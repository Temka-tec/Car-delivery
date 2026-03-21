import { Webhook } from "svix";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response("Missing CLERK_WEBHOOK_SECRET", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_ts = headerPayload.get("svix-timestamp");
  const svix_sig = headerPayload.get("svix-signature");

  if (!svix_id || !svix_ts || !svix_sig) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let evt: {
    type: string;
    data: {
      id: string;
      first_name?: string | null;
      last_name?: string | null;
      email_addresses?: Array<{ email_address: string }>;
    };
  };

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_ts,
      "svix-signature": svix_sig,
    }) as typeof evt;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (evt.type === "user.created") {
    const primaryEmail = evt.data.email_addresses?.[0]?.email_address;

    if (!primaryEmail) {
      return new Response("Missing user email", { status: 400 });
    }

    await prisma.user.upsert({
      where: {
        clerkId: evt.data.id,
      },
      create: {
        clerkId: evt.data.id,
        email: primaryEmail,
        name: [evt.data.first_name, evt.data.last_name]
          .filter(Boolean)
          .join(" ")
          .trim() || null,
      },
      update: {
        email: primaryEmail,
        name: [evt.data.first_name, evt.data.last_name]
          .filter(Boolean)
          .join(" ")
          .trim() || null,
      },
    });
  }

  return new Response("OK", { status: 200 });
}
