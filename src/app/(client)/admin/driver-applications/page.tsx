import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminApplicationActions } from "./_components/AdminApplicationActions";
import { getCurrentViewer } from "@/lib/current-viewer";
import { prisma } from "@/lib/prisma";

const statusTone: Record<string, string> = {
  PENDING: "text-[#FBBF24] bg-[rgba(251,191,36,0.12)]",
  REVIEWING: "text-[var(--color-gold)] bg-[rgba(201,168,76,0.12)]",
  APPROVED: "text-[#3ECF8E] bg-[rgba(62,207,142,0.12)]",
  REJECTED: "text-[#F87171] bg-[rgba(248,113,113,0.12)]",
};

const statusLabel: Record<string, string> = {
  PENDING: "Хүлээгдэж байна",
  REVIEWING: "Шалгаж байна",
  APPROVED: "Зөвшөөрсөн",
  REJECTED: "Татгалзсан",
};

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);

export default async function AdminDriverApplicationsPage() {
  const viewer = await getCurrentViewer();

  if (!viewer.isSignedIn) {
    redirect("/sign-in?redirect_url=/admin/driver-applications");
  }

  if (!viewer.isAdmin) {
    redirect("/");
  }

  const applications = await prisma.driverApplication.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-6 py-8 text-[var(--color-text)] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] px-3 py-1 text-xs text-[var(--color-gold)]">
              Admin
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.04em]">
              Жолоочийн хүсэлтүүд
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Mail дээр ирж буй бүх хүсэлт энд бас харагдана. Эндээс approve,
              reviewing, reject хийж болно.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-white/8 px-5 py-3 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
          >
            Нүүр рүү буцах
          </Link>
        </div>

        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-8 text-sm text-[var(--color-muted)]">
              Одоогоор хүсэлт ирээгүй байна.
            </div>
          ) : null}

          {applications.map((application) => (
            <section
              key={application.id}
              className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5"
            >
              <div className="flex flex-col gap-4 border-b border-white/8 pb-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="font-display text-2xl font-bold">
                    {application.firstName} {application.lastName}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
                    <span>{application.email}</span>
                    <span>{application.phone}</span>
                    <span>{formatDate(application.createdAt)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 lg:items-end">
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${statusTone[application.status]}`}
                  >
                    {statusLabel[application.status]}
                  </span>
                  <AdminApplicationActions
                    applicationId={application.id}
                    currentStatus={application.status}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Регистр", value: application.registerNumber },
                  { label: "Үнэмлэх", value: application.licenseNumber },
                  { label: "Ангилал", value: application.licenseClass },
                  { label: "Туршлага", value: application.drivingExperience },
                  {
                    label: "Машин",
                    value: `${application.carMake} ${application.carModel}`,
                  },
                  { label: "Улсын дугаар", value: application.plateNumber },
                  { label: "Суудал", value: application.seatCount },
                  {
                    label: "Өдрийн үнэ",
                    value: `${application.dailyRate.toLocaleString("mn-MN")}₮`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4"
                  >
                    <div className="text-xs text-[var(--color-muted)]">{item.label}</div>
                    <div className="mt-2 text-sm font-medium">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4">
                  <div className="text-xs text-[var(--color-muted)]">Гэрийн хаяг</div>
                  <div className="mt-2 text-sm font-medium">
                    {application.homeAddress || "Оруулаагүй"}
                  </div>
                </div>
                <div className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4">
                  <div className="text-xs text-[var(--color-muted)]">Нэмэлт тайлбар</div>
                  <div className="mt-2 text-sm font-medium">
                    {application.carNotes || "Оруулаагүй"}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-white/8 bg-[var(--color-panel)] p-4">
                <div className="text-xs text-[var(--color-muted)]">Хавсаргасан файлууд</div>
                <div className="mt-3 grid gap-2 text-sm text-[var(--color-text)] md:grid-cols-2 xl:grid-cols-3">
                  {[
                    application.profilePhotoName,
                    application.licenseFrontName,
                    application.licenseBackName,
                    application.licenseSelfieName,
                    application.carFrontName,
                    application.carBackName,
                    application.carInteriorName,
                  ]
                    .filter((value): value is string => Boolean(value))
                    .map((fileName) => (
                      <div
                        key={fileName}
                        className="rounded-lg border border-white/8 px-3 py-2"
                      >
                        {fileName}
                      </div>
                    ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
