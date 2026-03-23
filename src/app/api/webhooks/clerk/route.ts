import { Webhook } from "svix";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";

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
  let evt: any;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return new Response("Webhook баталгаажуулалт амжилтгүй", { status: 400 });
  }

  // Хэрэглэгч бүртгүүлэхэд DB-д хадгалах
  if (evt.type === "user.created") {
    await connectDB();
    await User.create({
      clerkId: evt.data.id,
      email: evt.data.email_addresses[0].email_address,
      name: `${evt.data.first_name ?? ""} ${evt.data.last_name ?? ""}`.trim(),
      phone: evt.data.phone_numbers?.[0]?.phone_number ?? null,
    });
  }

  // Хэрэглэгч мэдээлэл шинэчлэхэд
  if (evt.type === "user.updated") {
    await connectDB();
    await User.findOneAndUpdate(
      { clerkId: evt.data.id },
      {
        email: evt.data.email_addresses[0].email_address,
        name: `${evt.data.first_name ?? ""} ${evt.data.last_name ?? ""}`.trim(),
      },
    );
  }

  // Хэрэглэгч устгагдахад
  if (evt.type === "user.deleted") {
    await connectDB();
    await User.findOneAndDelete({ clerkId: evt.data.id });
  }

  return new Response("OK", { status: 200 });
}
