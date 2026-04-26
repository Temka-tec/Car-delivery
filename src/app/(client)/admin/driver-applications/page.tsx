import Link from "next/link";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";

import { AdminApplicationActions } from "./_components/AdminApplicationActions";
import { AdminApplicationGallery } from "./_components/AdminApplicationGallery";
import { getCurrentViewer } from "@/lib/current-viewer";
import { prisma } from "@/lib/prisma";

const statusTone: Record<string, string> = {
  PENDING: "text-[#FBBF24] bg-[rgba(251,191,36,0.12)]",
  REVIEWING: "text-[var(--color-gold)] bg-[rgba(201,168,76,0.12)]",
  APPROVED: "text-[#3ECF8E] bg-[rgba(62,207,142,0.12)]",
  REJECTED: "text-[#F87171] bg-[rgba(248,113,113,0.12)]",
};

const statusDotColor: Record<string, string> = {
  PENDING: "#FBBF24",
  REVIEWING: "#c9a84c",
  APPROVED: "#3ECF8E",
  REJECTED: "#F87171",
};

const statusPulse: Record<string, boolean> = {
  PENDING: true,
  REVIEWING: true,
  APPROVED: false,
  REJECTED: false,
};

const statusLabel: Record<string, string> = {
  PENDING: "Шинэ хүсэлт",
  REVIEWING: "Шалгаж байсан",
  APPROVED: "Зөвшөөрсөн",
  REJECTED: "Татгалзсан",
};

const statusTabs = [
  { key: "new", label: "Шинэ хүсэлт" },
  { key: "approved", label: "Зөвшөөрөгдсөн" },
  { key: "rejected", label: "Татгалзсан" },
] as const;

type StatusTabKey = (typeof statusTabs)[number]["key"];

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);

const carImageLabels = {
  carFrontName: "Урд зураг",
  carBackName: "Ар зураг",
  carInteriorName: "Дотор зураг",
} as const;

const normalizeStatusFilter = (
  value: string | string[] | undefined,
): StatusTabKey => {
  if (value === "approved" || value === "rejected") {
    return value;
  }

  return "new";
};

export default async function AdminDriverApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  const viewer = await getCurrentViewer();

  if (!viewer.isSignedIn) {
    redirect("/sign-in?redirect_url=/admin/driver-applications");
  }

  if (!viewer.isAdmin) {
    redirect("/");
  }

  const { status } = await searchParams;
  const activeTab = normalizeStatusFilter(status);

  const where: Prisma.DriverApplicationWhereInput =
    activeTab === "approved"
      ? { status: "APPROVED" as const }
      : activeTab === "rejected"
        ? { status: "REJECTED" as const }
        : {
            status: {
              in: ["PENDING", "REVIEWING"],
            },
          };

  const [applications, newCount, approvedCount, rejectedCount] =
    await Promise.all([
      prisma.driverApplication.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
        },
      }),
      prisma.driverApplication.count({
        where: {
          status: {
            in: ["PENDING", "REVIEWING"],
          },
        },
      }),
      prisma.driverApplication.count({
        where: {
          status: "APPROVED",
        },
      }),
      prisma.driverApplication.count({
        where: {
          status: "REJECTED",
        },
      }),
    ]);

  const tabCounts: Record<StatusTabKey, number> = {
    new: newCount,
    approved: approvedCount,
    rejected: rejectedCount,
  };

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
              Шинэ хүсэлтүүдийг зөвшөөрөх эсвэл татгалзах, мөн өмнөх шийдвэрүүдийг
              filter-ээр харах боломжтой.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-white/8 px-5 py-3 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
          >
            Нүүр рүү буцах
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {statusTabs.map((tab) => {
            const isActive = tab.key === activeTab;

            return (
              <Link
                key={tab.key}
                href={
                  tab.key === "new"
                    ? "/admin/driver-applications"
                    : `/admin/driver-applications?status=${tab.key}`
                }
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  isActive
                    ? "border-[rgba(201,168,76,0.42)] bg-[rgba(201,168,76,0.14)] text-[var(--color-gold)]"
                    : "border-white/8 bg-[var(--color-surface)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                <span>{tab.label}</span>
                <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">
                  {tabCounts[tab.key]}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-8 text-sm text-[var(--color-muted)]">
              Энэ ангилалд хүсэлт алга байна.
            </div>
          ) : null}

          {applications.map((application) => {
            const carImages = [
              {
                key: "carFrontName",
                label: carImageLabels.carFrontName,
                value: application.carFrontName,
              },
              {
                key: "carBackName",
                label: carImageLabels.carBackName,
                value: application.carBackName,
              },
              {
                key: "carInteriorName",
                label: carImageLabels.carInteriorName,
                value: application.carInteriorName,
              },
            ].filter(
              (
                item,
              ): item is {
                key: string;
                label: (typeof carImageLabels)[keyof typeof carImageLabels];
                value: string;
              } => Boolean(item.value),
            );

            const isDecisionTab = activeTab !== "new";
            const driverName =
              [application.firstName, application.lastName].filter(Boolean).join(" ") ||
              "Нэргүй";
            const driverPhone = application.phone || "Утас оруулаагүй";

            return (
              <section
                key={application.id}
                className="card-lift rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5"
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
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${statusTone[application.status]}`}
                    >
                      <span
                        className={
                          statusPulse[application.status]
                            ? "badge-dot-pulse"
                            : "inline-block h-1.5 w-1.5 rounded-full"
                        }
                        style={{
                          background: statusDotColor[application.status],
                          width: 6,
                          height: 6,
                          flexShrink: 0,
                        }}
                      />
                      {statusLabel[application.status]}
                    </span>
                    {!isDecisionTab ? (
                      <AdminApplicationActions
                        applicationId={application.id}
                        currentStatus={application.status}
                      />
                    ) : null}
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
                      <div className="text-xs text-[var(--color-muted)]">
                        {item.label}
                      </div>
                      <div className="mt-2 text-sm font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.95fr]">
                  <AdminApplicationGallery
                    carMake={application.carMake}
                    carModel={application.carModel}
                    driverName={driverName}
                    driverPhone={driverPhone}
                    images={carImages}
                  />

                  <div className="space-y-4">
                    <div className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4">
                      <div className="text-xs text-[var(--color-muted)]">
                        Гэрийн хаяг
                      </div>
                      <div className="mt-2 text-sm font-medium">
                        {application.homeAddress || "Оруулаагүй"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4">
                      <div className="text-xs text-[var(--color-muted)]">
                        Нэмэлт тайлбар
                      </div>
                      <div className="mt-2 text-sm font-medium">
                        {application.carNotes || "Оруулаагүй"}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
