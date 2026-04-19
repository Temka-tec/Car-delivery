import Image from "next/image";
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

const isStoredImagePath = (value: string | null | undefined) =>
  Boolean(value?.startsWith("/uploads/"));

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

  const where =
    activeTab === "approved"
      ? { status: "APPROVED" as const }
      : activeTab === "rejected"
        ? { status: "REJECTED" as const }
        : { status: { in: ["PENDING", "REVIEWING"] as const } };

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
            ].filter((item): item is { key: string; label: string; value: string } =>
              Boolean(item.value),
            );

            const coverImage = carImages[0] ?? null;
            const coverImageIsStored = isStoredImagePath(coverImage?.value);
            const isDecisionTab = activeTab !== "new";

            return (
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
                  <div className="rounded-[24px] border border-[rgba(201,168,76,0.18)] bg-[linear-gradient(145deg,rgba(201,168,76,0.14),rgba(255,255,255,0.02))] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-gold)]">
                          Машины зургууд
                        </div>
                        <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.04em]">
                          {application.carMake} {application.carModel}
                        </h2>
                        <p className="mt-2 text-sm text-[var(--color-muted)]">
                          Машинтай холбоотой upload хийсэн зургуудыг энд нэгтгэж
                          харууллаа.
                        </p>
                      </div>
                      <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-[var(--color-muted)]">
                        {carImages.length} зураг
                      </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.16),rgba(10,10,15,0.8))]">
                      {coverImage && coverImageIsStored ? (
                        <div className="relative h-72 w-full">
                          <Image
                            src={coverImage.value}
                            alt={`${application.carMake} ${application.carModel} ${coverImage.label}`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-5">
                            <div className="text-xs text-[var(--color-gold)]">
                              {coverImage.label}
                            </div>
                            <div className="mt-1 text-lg font-semibold text-white">
                              {application.carMake} {application.carModel}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex min-h-52 flex-col justify-between gap-6 p-6">
                          <div className="text-6xl leading-none">🚘</div>
                          <div>
                            <div className="text-xs text-[var(--color-gold)]">
                              {coverImage?.label || "Машины үндсэн зураг"}
                            </div>
                            <div className="mt-2 text-lg font-semibold">
                              {coverImage?.value || "Зураг оруулаагүй"}
                            </div>
                            <div className="mt-2 text-sm text-[var(--color-muted)]">
                              {coverImage
                                ? "Энэ бичлэг хуучин filename хадгалсан тул preview гарахгүй байна. Шинэ upload-ууд зураг болж харагдана."
                                : "Энэ хүсэлт дээр машинтай холбоотой зураг хавсаргагдаагүй байна."}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {[
                        {
                          label: carImageLabels.carFrontName,
                          value: application.carFrontName,
                          icon: "↗",
                        },
                        {
                          label: carImageLabels.carBackName,
                          value: application.carBackName,
                          icon: "↘",
                        },
                        {
                          label: carImageLabels.carInteriorName,
                          value: application.carInteriorName,
                          icon: "▣",
                        },
                      ].map((item) => (
                        <div
                          key={`${application.id}-${item.label}`}
                          className="overflow-hidden rounded-2xl border border-white/8 bg-[var(--color-panel)]"
                        >
                          {item.value && isStoredImagePath(item.value) ? (
                            <div className="relative h-40 w-full">
                              <Image
                                src={item.value}
                                alt={`${application.carMake} ${application.carModel} ${item.label}`}
                                fill
                                sizes="(max-width: 640px) 100vw, 33vw"
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="flex h-40 items-center justify-center bg-[linear-gradient(145deg,rgba(201,168,76,0.12),rgba(255,255,255,0.02))] text-3xl text-[var(--color-gold)]">
                              {item.icon}
                            </div>
                          )}
                          <div className="p-4">
                            <div className="text-xs text-[var(--color-muted)]">
                              {item.label}
                            </div>
                            <div className="mt-1 break-all text-sm font-medium">
                              {item.value || "Оруулаагүй"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

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
