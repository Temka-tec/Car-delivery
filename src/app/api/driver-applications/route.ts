import { auth, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@/generated/prisma/client";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

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
  dailyRate: "Өдрийн үнэ",
  carNotes: "Нэмэлт тайлбар",
};

const uploadFieldLabels = {
  profilePhoto: "Профайл зураг",
  licenseFront: "Үнэмлэхийн урд тал",
  licenseBack: "Үнэмлэхийн ар тал",
  licenseSelfie: "Selfie + үнэмлэх",
  carFront: "Машины урд зураг",
  carBack: "Машины ар зураг",
  carInterior: "Машины дотор зураг",
} as const;

const maxUploadSize = 5 * 1024 * 1024;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getTextValue = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const formatBytes = (value: number) => {
  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(value / 1024))} KB`;
};

const isMissingTableError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === "P2021";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Нэвтэрсэн хэрэглэгч байхгүй байна.", { status: 401 });
  }

  if (!resendApiKey) {
    return new Response("Missing RESEND_API_KEY", { status: 500 });
  }

  const user = await currentUser();
  const formData = await req.formData();
  const body = Object.fromEntries(
    Object.keys(fieldLabels).map((key) => [key, getTextValue(formData.get(key))]),
  ) as Record<string, string>;

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
    "dailyRate",
  ];

  for (const field of requiredFields) {
    if (!body[field]?.toString().trim()) {
      return new Response(`${fieldLabels[field] || field} дутуу байна.`, {
        status: 400,
      });
    }
  }

  if (!/^\d+$/.test(body.dailyRate) || Number(body.dailyRate) <= 0) {
    return new Response("Өдрийн үнэ зөв тоо байх ёстой.", {
      status: 400,
    });
  }

  let attachmentEntries: Array<{
    label: string;
    originalName: string;
    size: number;
    attachment: {
      filename: string;
      content: Buffer;
      contentType: string;
    };
  }>;

  try {
    attachmentEntries = await Promise.all(
      Object.entries(uploadFieldLabels).map(async ([field, label]) => {
        const file = formData.get(field);

        if (!(file instanceof File) || file.size === 0) {
          throw new Error(`${label} дутуу байна.`);
        }

        if (!file.type.startsWith("image/")) {
          throw new Error(`${label} зөвхөн зураг файл байх ёстой.`);
        }

        if (file.size > maxUploadSize) {
          throw new Error(`${label} 5MB-аас ихгүй байх ёстой.`);
        }

        return {
          label,
          originalName: file.name,
          size: file.size,
          attachment: {
            filename: file.name,
            content: Buffer.from(await file.arrayBuffer()),
            contentType: file.type,
          },
        };
      }),
    );
  } catch (error) {
    return new Response(
      error instanceof Error ? error.message : "Зураг шалгах үед алдаа гарлаа.",
      { status: 400 },
    );
  }

  const resend = new Resend(resendApiKey);
  const rows = Object.entries(fieldLabels)
    .map(([key, label]) => {
      const value = escapeHtml(body[key]?.toString().trim() || "—");

      return `<tr>
        <td style="padding:8px 10px;border:1px solid #e5e7eb;font-weight:600;">${escapeHtml(label)}</td>
        <td style="padding:8px 10px;border:1px solid #e5e7eb;">${value}</td>
      </tr>`;
    })
    .join("");
  const attachmentRows = attachmentEntries
    .map(
      ({ label, originalName, size }) => `<tr>
        <td style="padding:8px 10px;border:1px solid #e5e7eb;font-weight:600;">${escapeHtml(label)}</td>
        <td style="padding:8px 10px;border:1px solid #e5e7eb;">${escapeHtml(originalName)} (${formatBytes(size)})</td>
      </tr>`,
    )
    .join("");

  const clerkName =
    user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unknown";
  const clerkEmail =
    user?.primaryEmailAddress?.emailAddress || body.email || "Unknown";
  const applicantEmail = body.email?.toString().trim() || clerkEmail;
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    await prisma.driverApplication.create({
      data: {
        userId: existingUser?.id,
        clerkId: userId,
        lastName: body.lastName,
        firstName: body.firstName,
        phone: body.phone,
        email: body.email,
        registerNumber: body.registerNumber,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        homeAddress: body.homeAddress || null,
        licenseNumber: body.licenseNumber,
        licenseClass: body.licenseClass,
        licenseIssuedAt: body.licenseIssuedAt ? new Date(body.licenseIssuedAt) : null,
        licenseExpiry: new Date(body.licenseExpiry),
        drivingExperience: body.drivingExperience,
        accidentHistory: body.accidentHistory || null,
        carMake: body.carMake,
        carModel: body.carModel,
        carYear: Number(body.carYear),
        carColor: body.carColor || null,
        plateNumber: body.plateNumber,
        seatCount: body.seatCount,
        transmission: body.transmission || null,
        enginePower: body.enginePower || null,
        dailyRate: Number(body.dailyRate),
        carNotes: body.carNotes || null,
        profilePhotoName:
          attachmentEntries.find(
            (item) => item.label === uploadFieldLabels.profilePhoto,
          )?.originalName || null,
        licenseFrontName:
          attachmentEntries.find(
            (item) => item.label === uploadFieldLabels.licenseFront,
          )?.originalName || null,
        licenseBackName:
          attachmentEntries.find(
            (item) => item.label === uploadFieldLabels.licenseBack,
          )?.originalName || null,
        licenseSelfieName:
          attachmentEntries.find(
            (item) => item.label === uploadFieldLabels.licenseSelfie,
          )?.originalName || null,
        carFrontName:
          attachmentEntries.find(
            (item) => item.label === uploadFieldLabels.carFront,
          )?.originalName || null,
        carBackName:
          attachmentEntries.find(
            (item) => item.label === uploadFieldLabels.carBack,
          )?.originalName || null,
        carInteriorName:
          attachmentEntries.find(
            (item) => item.label === uploadFieldLabels.carInterior,
          )?.originalName || null,
      },
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return new Response(
        "Өгөгдлийн сангийн хүснэгт хараахан бэлэн болоогүй байна. `npx prisma db push` ажиллуулаад дахин оролдоно уу.",
        { status: 500 },
      );
    }

    return new Response("Хүсэлтийг өгөгдлийн санд хадгалах үед алдаа гарлаа.", {
      status: 500,
    });
  }

  try {
    await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        replyTo: applicantEmail,
        subject: `Шинэ жолоочийн хүсэлт: ${body.firstName} ${body.lastName}`,
        attachments: attachmentEntries.map(({ attachment }) => attachment),
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
            <h2 style="margin-bottom:8px;">Шинэ жолоочийн хүсэлт ирлээ</h2>
            <p style="margin:0 0 16px;">Clerk хэрэглэгч: <strong>${escapeHtml(clerkName)}</strong> (${escapeHtml(clerkEmail)})</p>
            <table style="border-collapse:collapse;width:100%;max-width:760px">
              <tbody>${rows}</tbody>
            </table>
            <h3 style="margin:20px 0 8px;">Хавсаргасан зургууд</h3>
            <table style="border-collapse:collapse;width:100%;max-width:760px">
              <tbody>${attachmentRows}</tbody>
            </table>
          </div>
        `,
      }),
      resend.emails.send({
        from: fromEmail,
        to: applicantEmail,
        subject: "Таны жолоочийн хүсэлт амжилттай илгээгдлээ",
        attachments: attachmentEntries.map(({ attachment }) => attachment),
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
            <h2 style="margin-bottom:8px;">Хүсэлт хүлээн авлаа</h2>
            <p style="margin:0 0 12px;">
              Сайн байна уу, <strong>${escapeHtml(body.firstName)} ${escapeHtml(body.lastName)}</strong>.
            </p>
            <p style="margin:0 0 16px;">
              Таны жолоочийн хүсэлтийг амжилттай хүлээн авлаа. Бид 1-2 ажлын өдрийн дотор шалгаад эргээд холбогдоно.
            </p>
            <table style="border-collapse:collapse;width:100%;max-width:760px">
              <tbody>${rows}</tbody>
            </table>
            <p style="margin:16px 0 8px;">Дараах зургууд таны хүсэлттэй хамт илгээгдлээ:</p>
            <table style="border-collapse:collapse;width:100%;max-width:760px">
              <tbody>${attachmentRows}</tbody>
            </table>
          </div>
        `,
      }),
    ]);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    return new Response("Resend рүү хүсэлт илгээх үед алдаа гарлаа.", {
      status: 500,
    });
  }

  return Response.json({ success: true });
}
