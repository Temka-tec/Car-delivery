import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return new Response("Webhook secret байхгүй", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Svix header байхгүй", { status: 400 });
  }

  const body = await req.text();

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: {
    type: string;
    data: {
      id: string;
      first_name?: string | null;
      last_name?: string | null;
      email_addresses?: Array<{ email_address: string }>;
      phone_numbers?: Array<{ phone_number: string }>;
    };
  };

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as typeof evt;
  } catch {
    return new Response("Webhook баталгаажуулалт амжилтгүй", { status: 400 });
  }

  const primaryEmail = evt.data.email_addresses?.[0]?.email_address;
  const phone = evt.data.phone_numbers?.[0]?.phone_number ?? null;
  const name =
    `${evt.data.first_name ?? ""} ${evt.data.last_name ?? ""}`.trim() || null;

  if (evt.type === "user.created" || evt.type === "user.updated") {
    if (!primaryEmail) {
      return new Response("Хэрэглэгчийн имэйл дутуу байна.", { status: 400 });
    }

    await prisma.user.upsert({
      where: { clerkId: evt.data.id },
      update: {
        email: primaryEmail,
        name,
        phone,
      },
      create: {
        clerkId: evt.data.id,
        email: primaryEmail,
        name,
        phone,
      },
    });
  }

  if (evt.type === "user.deleted") {
    await prisma.user.deleteMany({
      where: {
        clerkId: evt.data.id,
      },
    });
  }

  return new Response("OK", { status: 200 });
}
