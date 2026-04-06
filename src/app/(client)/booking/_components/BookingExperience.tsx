"use client";

import Link from "next/link";
import { useState } from "react";
import type { CarListItem } from "@/lib/car-data";

import { filterGroups, searchDefaults } from "./booking-data";

type BookingCar = Omit<CarListItem, "price"> & {
  selected: boolean;
  premium: boolean;
  meta: string;
  features: string[];
  driver: CarListItem["driver"] & { stats: string };
  price: number;
  ratingCount: string;
};

const formatPrice = (value: number) => `₮${value.toLocaleString()}`;

const mapBookingCars = (cars: CarListItem[]): BookingCar[] =>
  cars.map((car, index) => ({
    ...car,
    meta: `${car.color} · ${car.transmission} · ${car.engine} · ${car.tags[0] ?? "Мэдээлэлгүй"}`,
    features: car.tags.map((tag) => `• ${tag}`),
    driver: {
      ...car.driver,
      stats: `${car.driver.rating} · ${car.driver.trips} аялал`,
    },
    price: car.priceValue,
    ratingCount: String(car.reviewCount),
    selected: index === 0,
    premium: car.badge !== "Сул",
  }));

export const BookingExperience = ({
  initialCars,
}: {
  initialCars: CarListItem[];
}) => {
  const bookingCars = mapBookingCars(initialCars);
  const [selectedCar, setSelectedCar] = useState<BookingCar | null>(null);
  const [priceMax, setPriceMax] = useState(searchDefaults.priceMax);
  const [modalStart, setModalStart] = useState(searchDefaults.startDate);
  const [modalEnd, setModalEnd] = useState(searchDefaults.endDate);
  const [success, setSuccess] = useState(false);

  const activeCar = selectedCar ?? bookingCars[0] ?? null;

  if (!activeCar) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h1 className="font-display text-3xl font-bold">Сул машин алга</h1>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            Одоогоор захиалах боломжтой машин бүртгэгдээгүй байна.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-[var(--color-gold)] px-5 py-3 text-sm font-medium text-[var(--color-ink)]"
          >
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </main>
    );
  }

  const startDate = new Date(modalStart);
  const endDate = new Date(modalEnd);
  const diffDays = Math.round(
    (endDate.getTime() - startDate.getTime()) / 86400000,
  );
  const bookingDays = Number.isNaN(diffDays) ? 1 : Math.max(1, diffDays);
  const subtotal = activeCar.price * bookingDays;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  const openBooking = (car: BookingCar) => {
    setSelectedCar(car);
    setSuccess(false);
  };

  const closeBooking = () => {
    setSelectedCar(null);
    setSuccess(false);
    setModalStart(searchDefaults.startDate);
    setModalEnd(searchDefaults.endDate);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/8 px-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-[-0.04em]"
          >
            ALPHARD<span className="text-[var(--color-gold)]">.</span>
          </Link>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <span className="text-sm text-[var(--color-muted)]">
              Сайн байна уу, Батаа
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.15)] text-sm font-medium text-[var(--color-gold)]">
              Б
            </div>
          </div>
        </header>

        <section className="border-b border-white/8 bg-[var(--color-surface)] px-2 py-6 sm:px-4">
          <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
            Машин хайх
          </p>
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Эхлэх огноо
              </span>
              <input
                defaultValue={searchDefaults.startDate}
                type="date"
                className="rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none transition focus:border-[rgba(201,168,76,0.25)]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Дуусах огноо
              </span>
              <input
                defaultValue={searchDefaults.endDate}
                type="date"
                className="rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none transition focus:border-[rgba(201,168,76,0.25)]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Чиглэл
              </span>
              <input
                defaultValue={searchDefaults.direction}
                type="text"
                className="rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none transition focus:border-[rgba(201,168,76,0.25)]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Суудлын тоо
              </span>
              <select className="rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none transition focus:border-[rgba(201,168,76,0.25)]">
                <option>Бүгд</option>
                <option>4-5 суудал</option>
                <option>7-8 суудал</option>
                <option>10+ суудал</option>
              </select>
            </label>
            <button className="h-11 rounded-lg bg-[var(--color-gold)] px-6 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]">
              Хайх
            </button>
          </div>
        </section>

        <section className="grid min-h-[680px] lg:grid-cols-[280px_1fr]">
          <aside className="border-r border-white/8 bg-[var(--color-surface)] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold">Шүүлт</h2>
              <button className="text-xs text-[var(--color-gold)]">
                Цэвэрлэх
              </button>
            </div>

            {filterGroups.map((group, index) => (
              <div
                key={group.title}
                className={index === 0 ? "" : "mt-5 border-t border-white/8 pt-5"}
              >
                <p className="mb-3 text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {group.title}
                </p>
                <div className="space-y-2.5">
                  {group.options.map((option) => (
                    <label
                      key={option.label}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        defaultChecked={option.checked}
                        type="checkbox"
                        className="h-4 w-4 accent-[var(--color-gold)]"
                      />
                      <span className="text-sm text-[var(--color-muted)]">
                        {option.label}
                      </span>
                      {"count" in option && typeof option.count === "number" ? (
                        <span className="ml-auto rounded-full border border-white/8 bg-[var(--color-panel)] px-2 py-0.5 text-[11px] text-[#5A5856]">
                          {option.count}
                        </span>
                      ) : null}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-5 border-t border-white/8 pt-5">
              <p className="mb-3 text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                Өдрийн үнэ (₮)
              </p>
              <input
                type="range"
                min="50000"
                max="500000"
                value={priceMax}
                onChange={(event) => setPriceMax(Number(event.target.value))}
                className="w-full accent-[var(--color-gold)]"
              />
              <div className="mt-1 flex justify-between text-[11px] text-[var(--color-muted)]">
                <span>₮50,000</span>
                <span>{formatPrice(priceMax)}</span>
              </div>
            </div>
          </aside>

          <div className="p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--color-muted)]">
                <strong className="font-medium text-[var(--color-text)]">
                  {bookingCars.length}
                </strong>{" "}
                машин олдлоо · 3 хоног
              </p>
              <select className="w-fit rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2 text-xs text-[var(--color-muted)] outline-none">
                <option>Үнэ: бага → их</option>
                <option>Үнэ: их → бага</option>
                <option>Үнэлгээгээр</option>
                <option>Шинэ нэмэгдсэн</option>
              </select>
            </div>

            <div className="space-y-4">
              {bookingCars.map((car) => {
                const isSelected = selectedCar
                  ? selectedCar.id === car.id
                  : car.selected;

                return (
                  <article
                    key={car.id}
                    className={`grid items-start overflow-hidden rounded-2xl border bg-[var(--color-panel)] transition hover:-translate-y-0.5 hover:border-[rgba(201,168,76,0.25)] xl:grid-cols-[200px_1fr_140px] ${
                      isSelected
                        ? "border-[var(--color-gold)] bg-[rgba(201,168,76,0.04)]"
                        : "border-white/8"
                    }`}
                  >
                    <div className="relative flex min-h-40 items-center justify-center bg-[linear-gradient(135deg,var(--color-panel),#1E1E2C)] text-6xl">
                      {car.icon}
                      <div
                        className={`absolute left-3 top-3 rounded-md border px-2 py-1 text-[10px] ${
                          car.premium
                            ? "border-[rgba(180,140,255,0.35)] bg-[rgba(100,60,200,0.2)] text-[#BB99FF]"
                            : "border-[rgba(45,200,100,0.3)] bg-[rgba(45,106,79,0.25)] text-[#5DE89A]"
                        }`}
                      >
                        {car.badge}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between p-5">
                      <div>
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h3 className="font-display text-lg font-bold">
                            {car.name}
                          </h3>
                          <span className="rounded-md border border-white/8 bg-[#22222E] px-2 py-1 text-[11px] text-[var(--color-muted)]">
                            {car.year}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-muted)]">
                          {car.meta}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {car.features.map((feature) => (
                            <span
                              key={feature}
                              className="rounded-md border border-white/8 bg-white/4 px-2 py-1 text-[11px] text-[var(--color-muted)]"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.15)] text-[10px] font-semibold text-[var(--color-gold)]">
                          {car.driver.initial}
                        </div>
                        <div className="text-xs">
                          <strong className="block text-sm font-medium text-[var(--color-text)]">
                            {car.driver.name}
                          </strong>
                          <span className="text-[var(--color-muted)]">
                            {car.driver.stats}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between border-t border-white/8 p-5 xl:border-l xl:border-t-0">
                      <div>
                        <div className="mb-1 flex items-center justify-end gap-1 text-xs">
                          <span className="text-[var(--color-gold)]">★★★★★</span>
                          <span className="font-medium">{car.rating}</span>
                          <span className="text-[var(--color-muted)]">
                            ({car.ratingCount})
                          </span>
                        </div>
                        <p className="text-right text-[10px] text-[var(--color-muted)]">
                          Өдрийн үнэ
                        </p>
                        <div className="font-display text-right text-2xl font-bold text-[var(--color-gold)]">
                          {formatPrice(car.price)}
                        </div>
                        <p className="text-right text-xs text-[var(--color-muted)]">
                          / өдөр
                        </p>
                      </div>

                      <div className="mt-4 space-y-2">
                        <button
                          onClick={() => openBooking(car)}
                          className="w-full rounded-lg bg-[var(--color-gold)] px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
                        >
                          Захиалах
                        </button>
                        <button className="w-full rounded-lg border border-white/8 px-4 py-2 text-sm text-[var(--color-muted)] transition hover:border-[rgba(201,168,76,0.25)] hover:text-[var(--color-text)]">
                          Дэлгэрэнгүй
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {selectedCar ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeBooking();
            }
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-[18px] border border-[rgba(201,168,76,0.25)] bg-[var(--color-surface)]">
            {success ? (
              <div className="p-8 text-center">
                <div className="text-5xl">✅</div>
                <h3 className="font-display mt-4 text-2xl font-bold">
                  Захиалга илгээгдлээ!
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-muted)]">
                  Жолооч таны захиалгыг хүлээн авч, удахгүй холбоо барина.
                  Мэдэгдэл имэйл болон утсанд очно.
                </p>

                <div className="mt-6 rounded-xl border border-white/8 bg-[var(--color-panel)] p-4 text-left text-sm">
                  <div className="flex justify-between border-b border-white/8 py-2">
                    <span className="text-[var(--color-muted)]">Машин</span>
                    <span className="font-medium">{selectedCar.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/8 py-2">
                    <span className="text-[var(--color-muted)]">Огноо</span>
                    <span className="font-medium">
                      {modalStart} → {modalEnd}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/8 py-2">
                    <span className="text-[var(--color-muted)]">
                      Захиалгын №
                    </span>
                    <span className="font-medium">#ALR-2026-0847</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[var(--color-muted)]">Төлөв</span>
                    <span className="font-medium text-[#5DE89A]">
                      ● Жолооч хүлээж байна
                    </span>
                  </div>
                </div>

                <button
                  onClick={closeBooking}
                  className="mt-6 w-full rounded-lg bg-[var(--color-gold)] px-5 py-3 text-sm font-medium text-[var(--color-ink)]"
                >
                  Миний захиалгууд →
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
                  <h3 className="font-display text-lg font-bold">
                    Захиалга баталгаажуулах
                  </h3>
                  <button
                    onClick={closeBooking}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/8 bg-[var(--color-panel)] text-[var(--color-muted)]"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/8 bg-[var(--color-panel)] p-4">
                    <div className="text-3xl">{selectedCar.icon}</div>
                    <div>
                      <strong className="block text-sm font-medium">
                        {selectedCar.name}
                      </strong>
                      <span className="text-xs text-[var(--color-muted)]">
                        {selectedCar.year} · Автомат
                      </span>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="font-display text-lg font-bold text-[var(--color-gold)]">
                        {formatPrice(selectedCar.price)}
                      </div>
                      <span className="text-[10px] text-[var(--color-muted)]">
                        / өдөр
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs text-[var(--color-muted)]">
                        Эхлэх огноо
                      </span>
                      <input
                        value={modalStart}
                        onChange={(event) => setModalStart(event.target.value)}
                        type="date"
                        className="rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs text-[var(--color-muted)]">
                        Дуусах огноо
                      </span>
                      <input
                        value={modalEnd}
                        onChange={(event) => setModalEnd(event.target.value)}
                        type="date"
                        className="rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 md:col-span-2">
                      <span className="text-xs text-[var(--color-muted)]">
                        Эхлэх цэг / чиглэл
                      </span>
                      <input
                        placeholder="Улаанбаатар, Сансар хороолол..."
                        type="text"
                        className="rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 md:col-span-2">
                      <span className="text-xs text-[var(--color-muted)]">
                        Нэмэлт хүсэлт
                      </span>
                      <input
                        placeholder="Зогсоол, орой авч явах гэх мэт..."
                        type="text"
                        className="rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none"
                      />
                    </label>
                  </div>

                  <div className="mt-5 rounded-xl border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.06)] p-4 text-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-[var(--color-muted)]">
                        {formatPrice(selectedCar.price)} × {bookingDays} өдөр
                      </span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[var(--color-muted)]">
                        Үйлчилгээний хөлс (5%)
                      </span>
                      <span>{formatPrice(serviceFee)}</span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-[rgba(201,168,76,0.25)] pt-3">
                      <span className="text-[var(--color-muted)]">Нийт дүн</span>
                      <span className="font-display text-lg font-bold text-[var(--color-gold)]">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-[#5A5856]">
                    <strong className="text-[var(--color-muted)]">
                      Анхааруулга:
                    </strong>{" "}
                    Аяллаа эхэлсний дараа жолооч төлбөрөө авна. Цуцлах
                    хүсэлтийг эхлэхээс 24 цагийн өмнө гаргана уу.
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={closeBooking}
                      className="flex-1 rounded-lg border border-white/8 px-4 py-3 text-sm text-[var(--color-muted)]"
                    >
                      Болих
                    </button>
                    <button
                      onClick={() => setSuccess(true)}
                      className="flex-[2] rounded-lg bg-[var(--color-gold)] px-4 py-3 text-sm font-medium text-[var(--color-ink)]"
                    >
                      Захиалга илгээх →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
};
