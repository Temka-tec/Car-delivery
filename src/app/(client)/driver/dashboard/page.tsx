import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutAction } from "@/components/sign-out-action";
import { prisma } from "@/lib/prisma";
import { getCurrentViewer } from "@/lib/current-viewer";

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("mn-MN", {
    style: "currency",
    currency: "MNT",
    maximumFractionDigits: 0,
  }).format(value);

const applicationStatusLabel: Record<string, string> = {
  PENDING: "Хүлээгдэж байна",
  REVIEWING: "Шалгаж байна",
  APPROVED: "Зөвшөөрөгдсөн",
  REJECTED: "Татгалзсан",
};

const driverStatusLabel: Record<string, string> = {
  PENDING: "Хүлээгдэж байна",
  APPROVED: "Идэвхтэй",
  REJECTED: "Татгалзсан",
};

const bookingStatusLabel: Record<string, string> = {
  PENDING: "Хүлээгдэж байна",
  CONFIRMED: "Баталгаажсан",
  ACTIVE: "Явж байна",
  COMPLETED: "Дууссан",
  CANCELLED: "Цуцлагдсан",
};

export default async function DriverDashboardPage() {
  const viewer = await getCurrentViewer();

  if (!viewer.isSignedIn) {
    redirect("/sign-in?redirect_url=/driver/dashboard");
  }

  if (!viewer.driverProfile) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] px-6 py-8 text-[var(--color-text)] sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="font-display text-2xl font-extrabold tracking-[-0.04em]"
            >
              ALPHARD<span className="text-[var(--color-gold)]">.</span>
            </Link>
            <SignOutAction className="rounded-xl border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.08)] px-5 py-3 text-sm text-[#F87171] transition hover:bg-[rgba(248,113,113,0.14)]" />
          </div>

          <section className="rounded-[28px] border border-white/8 bg-[var(--color-surface)] p-6 sm:p-8">
            <div className="inline-flex rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] px-3 py-1 text-xs text-[var(--color-gold)]">
              Хүсэлтийн самбар
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.04em]">
              {viewer.latestDriverApplication
                ? "Таны жолоочийн хүсэлтийн төлөв"
                : "Жолоочийн хүсэлт илгээгээгүй байна"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              {viewer.latestDriverApplication
                ? "Жолоочийн dashboard одоогоор зөвхөн батлагдсан жолооч нарт нээгдэнэ. Доор таны хамгийн сүүлд илгээсэн хүсэлтийн төлөв харагдаж байна."
                : "Та жолоочоор ажиллахыг хүсвэл эхлээд хүсэлтээ бөглөж илгээнэ үү."}
            </p>

            {viewer.latestDriverApplication ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-[var(--color-panel)] p-4">
                  <div className="text-xs text-[var(--color-muted)]">Төлөв</div>
                  <div className="mt-2 text-lg font-semibold text-[var(--color-gold)]">
                    {applicationStatusLabel[viewer.latestDriverApplication.status]}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-[var(--color-panel)] p-4">
                  <div className="text-xs text-[var(--color-muted)]">Илгээсэн огноо</div>
                  <div className="mt-2 text-lg font-semibold">
                    {formatDate(viewer.latestDriverApplication.createdAt)}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-[var(--color-panel)] p-4">
                  <div className="text-xs text-[var(--color-muted)]">Машин</div>
                  <div className="mt-2 text-lg font-semibold">
                    {viewer.latestDriverApplication.carMake}{" "}
                    {viewer.latestDriverApplication.carModel}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={viewer.latestDriverApplication ? "/" : "/driver/register"}
                className="rounded-xl bg-[var(--color-gold)] px-5 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
              >
                {viewer.latestDriverApplication ? "Home руу буцах" : "Хүсэлт бөглөх"}
              </Link>
              <Link
                href="/driver/profile"
                className="rounded-xl border border-white/8 px-5 py-3 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
              >
                Профайл харах
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const bookings = await prisma.booking.findMany({
    where: {
      driverId: viewer.driverProfile.id,
    },
    orderBy: {
      startDate: "desc",
    },
    take: 8,
    include: {
      user: true,
      car: true,
      review: true,
    },
  });

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter((booking) => booking.status === "ACTIVE");
  const completedBookings = bookings.filter(
    (booking) => booking.status === "COMPLETED",
  );
  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + (booking.totalPrice ?? 0),
    0,
  );
  const ratings = bookings
    .map((booking) => booking.review?.rating)
    .filter((rating): rating is number => typeof rating === "number");
  const averageRating = ratings.length
    ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
    : "Шинэ";
  const displayName = viewer.displayName || "Жолооч";
  const carName = viewer.driverProfile.car
    ? `${viewer.driverProfile.car.make} ${viewer.driverProfile.car.model}`
    : "Машин бүртгэгдээгүй";

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-6 py-8 text-[var(--color-text)] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] px-3 py-1 text-xs text-[var(--color-gold)]">
              Жолоочийн dashboard
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.04em]">
              Сайн байна уу, {displayName}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Таны бодит захиалга, машины мэдээлэл, жолоочийн төлөв энд харагдана.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/driver/profile"
              className="rounded-xl border border-white/8 px-5 py-3 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
            >
              Профайл
            </Link>
            <SignOutAction className="rounded-xl border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.08)] px-5 py-3 text-sm text-[#F87171] transition hover:bg-[rgba(248,113,113,0.14)]" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Төлөв",
              value: driverStatusLabel[viewer.driverProfile.status],
            },
            {
              label: "Нийт захиалга",
              value: String(totalBookings),
            },
            {
              label: "Нийт орлого",
              value: formatCurrency(totalRevenue),
            },
            {
              label: "Дундаж үнэлгээ",
              value: averageRating,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/8 bg-[var(--color-surface)] p-5"
            >
              <div className="text-xs text-[var(--color-muted)]">{item.label}</div>
              <div className="mt-3 font-display text-3xl font-bold text-[var(--color-gold)]">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.35fr_1fr]">
          <section className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="font-display text-lg font-bold">Сүүлийн захиалгууд</div>
              <span className="text-xs text-[var(--color-muted)]">
                Идэвхтэй {activeBookings.length} · Дууссан {completedBookings.length}
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--color-panel)] p-6 text-sm text-[var(--color-muted)]">
                Танд одоогоор захиалга алга байна.
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl border border-white/8 bg-[var(--color-panel)] p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="font-medium">
                          {booking.car.make} {booking.car.model}
                        </div>
                        <div className="mt-1 text-sm text-[var(--color-muted)]">
                          {booking.user.name || booking.user.email} · {formatDate(booking.startDate)}
                          {" - "}
                          {formatDate(booking.endDate)}
                        </div>
                        <div className="mt-2 text-xs text-[var(--color-muted)]">
                          {booking.destination || "Чиглэл оруулаагүй"}
                        </div>
                        <div className="mt-1 text-xs text-[var(--color-muted)]">
                          {booking.notes || "Дэлгэрэнгүй байршил оруулаагүй"}
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-sm font-medium text-[var(--color-gold)]">
                          {booking.totalPrice
                            ? formatCurrency(booking.totalPrice)
                            : "Үнэ баталгаажаагүй"}
                        </div>
                        <div className="mt-1 text-xs text-[var(--color-muted)]">
                          {bookingStatusLabel[booking.status]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="font-display text-lg font-bold">Миний машин</div>
              <div className="mt-4 rounded-2xl border border-white/8 bg-[var(--color-panel)] p-4">
                <div className="text-sm font-medium">{carName}</div>
                <div className="mt-2 text-sm text-[var(--color-muted)]">
                  {viewer.driverProfile.car
                    ? `${viewer.driverProfile.car.year} · ${viewer.driverProfile.car.plate} · ${viewer.driverProfile.car.seats} суудал`
                    : "Одоогоор машин холбогдоогүй байна."}
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="font-display text-lg font-bold">Жолоочийн мэдээлэл</div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4">
                  <div className="text-xs text-[var(--color-muted)]">Нэр</div>
                  <div className="mt-2 font-medium">{displayName}</div>
                </div>
                <div className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4">
                  <div className="text-xs text-[var(--color-muted)]">И-мэйл</div>
                  <div className="mt-2 font-medium">
                    {viewer.displayEmail || "Оруулаагүй"}
                  </div>
                </div>
                <div className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4">
                  <div className="text-xs text-[var(--color-muted)]">Туршлага</div>
                  <div className="mt-2 font-medium">
                    {viewer.driverProfile.experience || "Оруулаагүй"}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
