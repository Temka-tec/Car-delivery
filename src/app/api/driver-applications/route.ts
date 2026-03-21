import { auth, currentUser } from "@clerk/nextjs/server";
import { Resend } from "resend";

const recipientEmail =
  process.env.DRIVER_APPLICATION_TO_EMAIL || "tematekoo198@gmail.com";
const fromEmail =
  process.env.RESEND_FROM_EMAIL || "Alphard Rentals <onboarding@resend.dev>";

const resendApiKey = process.env.RESEND_API_KEY;

const fieldLabels: Record<string, string> = {
  lastName: "Овог",
  firstName: "Нэр",
  phone: "Утасны дугаар",
  email: "И-мэйл хаяг",
  registerNumber: "Регистрийн дугаар",
  birthDate: "Төрсөн огноо",
  homeAddress: "Гэрийн хаяг",
  licenseNumber: "Үнэмлэхийн дугаар",
  licenseClass: "Ангилал",
  licenseIssuedAt: "Олгосон огноо",
  licenseExpiry: "Дуусах огноо",
  drivingExperience: "Жолоодсон жил",
  accidentHistory: "Осол гарч байсан уу",
  carMake: "Машины марк",
  carModel: "Загвар",
  carYear: "Он",
  carColor: "Өнгө",
  plateNumber: "Улсын дугаар",
  seatCount: "Суудлын тоо",
  transmission: "Хурдны хайрцаг",
  enginePower: "Хөдөлгүүрийн хүч",
  carNotes: "Нэмэлт тайлбар",
};

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Нэвтэрсэн хэрэглэгч байхгүй байна.", { status: 401 });
  }

  if (!resendApiKey) {
    return new Response("Missing RESEND_API_KEY", { status: 500 });
  }

  const user = await currentUser();
  const body = (await req.json()) as Record<string, string>;

  const requiredFields = [
    "lastName",
    "firstName",
    "phone",
    "email",
    "registerNumber",
    "licenseNumber",
    "licenseClass",
    "licenseExpiry",
    "carMake",
    "carModel",
    "carYear",
    "plateNumber",
  ];

  for (const field of requiredFields) {
    if (!body[field]?.toString().trim()) {
      return new Response(`${fieldLabels[field] || field} дутуу байна.`, {
        status: 400,
      });
    }
  }

  const resend = new Resend(resendApiKey);
  const rows = Object.entries(fieldLabels)
    .map(([key, label]) => {
      const value = body[key]?.toString().trim() || "—";

      return `<tr>
        <td style="padding:8px 10px;border:1px solid #e5e7eb;font-weight:600;">${label}</td>
        <td style="padding:8px 10px;border:1px solid #e5e7eb;">${value}</td>
      </tr>`;
    })
    .join("");

  const clerkName =
    user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unknown";
  const clerkEmail =
    user?.primaryEmailAddress?.emailAddress || body.email || "Unknown";
  const applicantEmail = body.email?.toString().trim() || clerkEmail;

  await Promise.all([
    resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      replyTo: applicantEmail,
      subject: `Шинэ жолоочийн хүсэлт: ${body.firstName} ${body.lastName}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
          <h2 style="margin-bottom:8px;">Шинэ жолоочийн хүсэлт ирлээ</h2>
          <p style="margin:0 0 16px;">Clerk хэрэглэгч: <strong>${clerkName}</strong> (${clerkEmail})</p>
          <table style="border-collapse:collapse;width:100%;max-width:760px">
            <tbody>${rows}</tbody>
          </table>
        </div>
      `,
    }),
    resend.emails.send({
      from: fromEmail,
      to: applicantEmail,
      subject: "Таны жолоочийн хүсэлт амжилттай илгээгдлээ",
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
          <h2 style="margin-bottom:8px;">Хүсэлт хүлээн авлаа</h2>
          <p style="margin:0 0 12px;">
            Сайн байна уу, <strong>${body.firstName} ${body.lastName}</strong>.
          </p>
          <p style="margin:0 0 16px;">
            Таны жолоочийн хүсэлтийг амжилттай хүлээн авлаа. Бид 1-2 ажлын өдрийн дотор шалгаад эргээд холбогдоно.
          </p>
          <table style="border-collapse:collapse;width:100%;max-width:760px">
            <tbody>${rows}</tbody>
          </table>
        </div>
      `,
    }),
  ]);

  return Response.json({ success: true });
}
