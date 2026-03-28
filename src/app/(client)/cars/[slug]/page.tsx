import Link from "next/link";
import { notFound } from "next/navigation";
import { getCarDetailsBySlug } from "@/lib/car-data";

const formatPrice = (value: number) => `₮${value.toLocaleString()}`;

export default async function CarDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = await getCarDetailsBySlug(slug);

  if (!car) {
    notFound();
  }

  const serviceFee = Math.round(car.priceValue * 0.05);
  const total = car.priceValue + serviceFee;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-6 text-[var(--color-text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm text-[var(--color-muted)] transition hover:text-[var(--color-gold)]"
          >
            ← Буцах
          </Link>
          <div
            className={`rounded-md px-3 py-1 text-xs tracking-[0.04em] ${car.badgeClassName}`}
          >
            {car.badge}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_420px]">
          <section>
            <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-[24px] border border-white/8 bg-[linear-gradient(135deg,#1A1A26,#22222E)]">
              <div className="font-display text-7xl font-extrabold tracking-[0.12em] text-white/80">
                {car.icon}
              </div>
              <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-black/35 px-3 py-2 text-xs text-[var(--color-muted)]">
                {car.name} {car.year} · {car.color}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {car.gallery.map((item, index) => (
                <div
                  key={`${car.slug}-${item}-${index}`}
                  className={`flex h-16 items-center justify-center rounded-2xl border text-2xl ${
                    index === 0
                      ? "border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.08)]"
                      : "border-white/8 bg-[var(--color-panel)]"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-7">
              <h1 className="font-display text-3xl font-extrabold tracking-[-0.04em]">
                {car.name} {car.year}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
                <span className="text-[var(--color-gold)]">
                  {"★".repeat(Math.round(car.rating))}
                </span>
                <span>{car.rating.toFixed(1)}</span>
                <span>· {car.reviewCount} үнэлгээ</span>
                <span>
                  · {car.color} · {car.transmission}
                </span>
                <span>· {car.location}</span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {car.features.map((feature) => (
                <div
                  key={`${car.slug}-${feature.label}`}
                  className="rounded-[18px] border border-white/8 bg-[var(--color-surface)] p-4"
                >
                  <div className="text-lg">{feature.icon}</div>
                  <div className="mt-3 text-xs text-[var(--color-muted)]">
                    {feature.label}
                  </div>
                  <div className="mt-1 text-sm font-medium text-[var(--color-text)]">
                    {feature.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 text-sm font-semibold text-[var(--color-text)]">
                Жолооч
              </div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.15)] font-semibold text-[var(--color-gold)]">
                    {car.driver.initial}
                  </div>
                  <div>
                    <div className="text-base font-semibold">{car.driver.name}</div>
                    <div className="text-sm text-[var(--color-muted)]">
                      {car.driver.detail}
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <div className="font-display text-lg text-[var(--color-gold)]">
                      {car.driver.rating}
                    </div>
                    <div className="text-[var(--color-muted)]">Үнэлгээ</div>
                  </div>
                  <div>
                    <div className="font-display text-lg text-[var(--color-gold)]">
                      {car.driver.trips}
                    </div>
                    <div className="text-[var(--color-muted)]">Аялал</div>
                  </div>
                  <div>
                    <div className="font-display text-lg text-[var(--color-gold)]">
                      {car.driver.phone}
                    </div>
                    <div className="text-[var(--color-muted)]">Утас</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 text-sm font-semibold text-[var(--color-text)]">
                Машины ерөнхий мэдээлэл
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Байршил", value: car.location },
                  { label: "Даатгал", value: car.insurance },
                  { label: "Хөдөлгүүр", value: car.engine },
                  { label: "Өдрийн үнэ", value: formatPrice(car.priceValue) },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/8 bg-[var(--color-panel)] px-4 py-3"
                  >
                    <div className="text-xs text-[var(--color-muted)]">
                      {item.label}
                    </div>
                    <div className="mt-1 text-sm font-medium text-[var(--color-text)]">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 text-sm font-semibold text-[var(--color-text)]">
                Үнэлгээ, сэтгэгдэл
              </div>
              <div className="space-y-4">
                {car.reviews.length === 0 ? (
                  <div className="rounded-2xl border border-white/8 bg-[var(--color-panel)] p-4 text-sm text-[var(--color-muted)]">
                    Одоогоор энэ машинд сэтгэгдэл бүртгэгдээгүй байна.
                  </div>
                ) : null}
                {car.reviews.map((review) => (
                  <div
                    key={`${car.slug}-${review.name}-${review.date}`}
                    className="border-b border-white/6 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-[var(--color-panel)] text-xs text-[var(--color-muted)]">
                        {review.initial}
                      </div>
                      <div className="text-sm font-medium">{review.name}</div>
                      <div className="text-xs text-[var(--color-gold)]">
                        {review.rating}
                      </div>
                      <div className="ml-auto text-xs text-[var(--color-muted)]">
                        {review.date}
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-[var(--color-muted)]">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-[24px] border border-white/8 bg-[var(--color-surface)]">
            <div className="border-b border-white/8 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="font-display text-3xl font-bold text-[var(--color-gold)]">
                    {car.price}
                  </span>
                  <span className="ml-1 text-sm text-[var(--color-muted)]">
                    / өдөр
                  </span>
                </div>
                <div className="text-sm text-[var(--color-muted)]">
                  ★ {car.rating.toFixed(1)} · {car.reviewCount}
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-[rgba(96,165,250,0.22)] bg-[rgba(96,165,250,0.08)] p-4 text-sm leading-6 text-[var(--color-muted)]">
                <div className="mb-1 font-medium text-[#60A5FA]">
                  {car.location}
                </div>
                Энэ машин одоогоор {car.badge.toLowerCase()} төлөвтэй бөгөөд
                жолоочийн мэдээлэл, үнэлгээ, өдрийн үнийн хамт шууд харагдана.
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <label className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
                  Эхлэх огноо
                  <input
                    defaultValue="2026-03-25"
                    type="date"
                    className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-[var(--color-text)] outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
                  Дуусах огноо
                  <input
                    defaultValue="2026-03-28"
                    type="date"
                    className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-[var(--color-text)] outline-none"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
                Чиглэл
                <input
                  defaultValue={car.location}
                  type="text"
                  className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-[var(--color-text)] outline-none"
                />
              </label>

              <label className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
                Зорчигчийн тоо
                <select className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-[var(--color-text)] outline-none">
                  <option>1-2 хүн</option>
                  <option>3-4 хүн</option>
                  <option>5-6 хүн</option>
                  <option>7+ хүн</option>
                </select>
              </label>

              <div className="rounded-2xl border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.06)] p-4 text-sm">
                <div className="mb-2 flex items-center justify-between text-[var(--color-muted)]">
                  <span>{formatPrice(car.priceValue)} × 1 өдөр</span>
                  <span>{formatPrice(car.priceValue)}</span>
                </div>
                <div className="mb-2 flex items-center justify-between text-[var(--color-muted)]">
                  <span>Үйлчилгээний хөлс (5%)</span>
                  <span>{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[rgba(201,168,76,0.18)] pt-2 font-medium">
                  <span>Нийт</span>
                  <span className="font-display text-xl text-[var(--color-gold)]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-[var(--color-panel)] p-4">
                <div className="mb-2 text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  Шууд холбогдох
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-base font-semibold text-[#3ECF8E]">
                    {car.driver.phone}
                  </div>
                  <a
                    href={`tel:${car.driver.phone.replaceAll(" ", "")}`}
                    className="rounded-lg border border-[rgba(62,207,142,0.35)] bg-[rgba(62,207,142,0.12)] px-3 py-2 text-sm text-[#3ECF8E]"
                  >
                    Залгах
                  </a>
                </div>
              </div>

              <div className="grid gap-2">
                <Link
                  href="/booking"
                  className="rounded-xl bg-[var(--color-gold)] px-4 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
                >
                  Захиалга илгээх
                </Link>
                <Link
                  href="/sign-in"
                  className="rounded-xl border border-[rgba(201,168,76,0.28)] px-4 py-3 text-center text-sm font-medium text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.08)]"
                >
                  Нэвтэрч үргэлжлүүлэх
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
