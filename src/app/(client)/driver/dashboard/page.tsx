"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

import { driverDashboardData } from "../_components/driver-dashboard-data";

type RequestStatus = "new" | "accepted" | "declined";

export default function DriverDashboardPage() {
  const { user } = useUser();
  const [isOnline, setIsOnline] = useState(true);
  const [requests, setRequests] = useState(
    driverDashboardData.requests.map((request) => ({
      ...request,
      status: "new" as RequestStatus,
    })),
  );

  const displayName =
    user?.fullName || user?.firstName || driverDashboardData.driver.name;
  const displayEmail =
    user?.primaryEmailAddress?.emailAddress || driverDashboardData.driver.email;

  return (
    <main className="grid min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] lg:grid-cols-[220px_1fr]">
      <aside className="flex flex-col gap-1 border-r border-white/8 bg-[var(--color-surface)] p-5">
        <div className="mb-3 border-b border-white/8 pb-5">
          <Link
            href="/"
            className="font-display text-xl font-extrabold tracking-[-0.04em]"
          >
            ALPHARD<span className="text-[var(--color-gold)]">.</span>
          </Link>
          <small className="mt-1 block text-[10px] text-[var(--color-muted)]">
            Жолоочийн хэсэг
          </small>
        </div>

        <div className="px-2 pt-1 text-[10px] uppercase tracking-[0.12em] text-[#4A4846]">
          Үндсэн
        </div>
        <Link
          href="/driver/dashboard"
          className="flex items-center gap-3 rounded-lg border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.1)] px-3 py-2.5 text-sm text-[var(--color-gold)]"
        >
          <span>📊</span>
          <span>Dashboard</span>
        </Link>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-panel)] hover:text-[var(--color-text)]">
          <span>📋</span>
          <span>Захиалгууд</span>
          <span className="ml-auto rounded-full bg-[var(--color-gold)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-ink)]">
            {requests.filter((request) => request.status === "new").length}
          </span>
        </button>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-panel)] hover:text-[var(--color-text)]">
          <span>🗓️</span>
          <span>Хуваарь</span>
        </button>

        <div className="mt-3 px-2 pt-1 text-[10px] uppercase tracking-[0.12em] text-[#4A4846]">
          Профайл
        </div>
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-panel)] hover:text-[var(--color-text)]">
          <span>🚙</span>
          <span>Миний машин</span>
        </button>
        <Link
          href="/driver/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-panel)] hover:text-[var(--color-text)]"
        >
          <span>👤</span>
          <span>Профайл</span>
        </Link>

        <div className="mt-auto space-y-3 border-t border-white/8 pt-4">
          <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-[var(--color-panel)] p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.1)] text-xs font-semibold text-[var(--color-gold)]">
              {displayName.charAt(0)}
            </div>
            <div>
              <strong className="block text-sm font-medium">{displayName}</strong>
              <span className="text-[10px] text-[#3ECF8E]">
                ● {isOnline ? "Онлайн" : "Офлайн"}
              </span>
            </div>
          </div>

          <SignOutButton>
            <button className="w-full rounded-lg border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.08)] px-4 py-2.5 text-sm text-[#F87171] transition hover:bg-[rgba(248,113,113,0.14)]">
              Гарах
            </button>
          </SignOutButton>
        </div>
      </aside>

      <section className="overflow-auto p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-[-0.04em]">
              Сайн байна уу, {displayName} 🚗
            </h1>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Өнөөдөр 3 сарын 20 · Баасан гараг
            </p>
          </div>

          <button
            onClick={() => setIsOnline((current) => !current)}
            className="inline-flex items-center gap-3 rounded-xl border border-white/8 bg-[var(--color-surface)] px-4 py-3 text-sm"
          >
            <span className="text-[var(--color-muted)]">Төлөв:</span>
            <span
              className={`inline-flex h-6 w-11 items-center rounded-full border px-1 transition ${
                isOnline
                  ? "border-[rgba(62,207,142,0.35)] bg-[rgba(62,207,142,0.15)]"
                  : "border-white/8 bg-[var(--color-panel)]"
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full transition ${
                  isOnline
                    ? "translate-x-5 bg-[#3ECF8E]"
                    : "translate-x-0 bg-[var(--color-muted)]"
                }`}
              />
            </span>
            <span className={isOnline ? "text-[#3ECF8E]" : "text-[var(--color-muted)]"}>
              {isOnline ? "Идэвхтэй" : "Офлайн"}
            </span>
          </button>
        </div>

        <div className="mb-6 grid gap-3 xl:grid-cols-4">
          {[
            {
              label: "Энэ сарын орлого",
              value: driverDashboardData.driver.monthlyIncome,
              sub: "↑ 22% өнгөрсөн сараас",
              icon: "💰",
              gold: true,
            },
            {
              label: "Нийт аялал",
              value: String(driverDashboardData.driver.trips),
              sub: "8 энэ 7 хоногт",
              icon: "🗺️",
            },
            {
              label: "Үнэлгээ",
              value: driverDashboardData.driver.rating,
              sub: `${driverDashboardData.driver.reviewCount} үнэлгээнээс`,
              icon: "⭐",
              gold: true,
            },
            {
              label: "Өнөөдрийн орлого",
              value: driverDashboardData.driver.todayIncome,
              sub: "1 аялал · үргэлжилж байна",
              icon: "📅",
              gold: true,
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-white/8 bg-[var(--color-surface)] p-4"
            >
              <div className="mb-3 flex items-center justify-between text-xs text-[var(--color-muted)]">
                <span>{metric.label}</span>
                <span>{metric.icon}</span>
              </div>
              <div
                className={`font-display text-3xl font-bold ${
                  metric.gold ? "text-[var(--color-gold)]" : ""
                }`}
              >
                {metric.value}
              </div>
              <div className="mt-2 text-xs text-[var(--color-muted)]">{metric.sub}</div>
            </div>
          ))}
        </div>

        <div className="mb-6 grid gap-4 rounded-2xl border border-[rgba(62,207,142,0.25)] bg-[linear-gradient(135deg,rgba(62,207,142,0.08),rgba(62,207,142,0.04))] p-5 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="text-4xl">🚙</div>
          <div>
            <div className="font-display text-lg font-bold">
              {driverDashboardData.activeBooking.car} —{" "}
              {driverDashboardData.activeBooking.route}
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-[var(--color-muted)]">
              <span>📅 {driverDashboardData.activeBooking.date}</span>
              <span>👤 {driverDashboardData.activeBooking.customer}</span>
              <span>📍 {driverDashboardData.activeBooking.destination}</span>
              <span>⏱️ {driverDashboardData.activeBooking.duration}</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-[var(--color-panel)]">
              <div
                className="h-1.5 rounded-full bg-[#3ECF8E]"
                style={{ width: driverDashboardData.activeBooking.progress }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-[var(--color-muted)]">
              <span>Эхэлсэн</span>
              <span>
                {driverDashboardData.activeBooking.progress} ·{" "}
                {driverDashboardData.activeBooking.remaining}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[var(--color-muted)]">
              Хүлээгдэж буй төлбөр
            </div>
            <div className="font-display text-2xl font-bold text-[#3ECF8E]">
              {driverDashboardData.activeBooking.amount}
            </div>
            <button className="mt-3 rounded-lg border border-[rgba(62,207,142,0.3)] bg-[rgba(62,207,142,0.12)] px-4 py-2 text-sm text-[#3ECF8E]">
              Аялал дуусгах
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-[var(--color-surface)]">
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                <div className="font-display text-sm font-bold">
                  Шинэ захиалгын хүсэлтүүд
                </div>
                <span className="rounded-md bg-[rgba(251,191,36,0.12)] px-2 py-1 text-[11px] text-[#FBBF24]">
                  {requests.filter((request) => request.status === "new").length} шинэ
                </span>
              </div>
              <div className="space-y-3 p-5">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className={`rounded-xl border p-4 ${
                      request.status === "accepted"
                        ? "border-[rgba(62,207,142,0.3)] bg-[rgba(62,207,142,0.06)]"
                        : request.status === "declined"
                          ? "border-[rgba(248,113,113,0.2)] bg-[rgba(248,113,113,0.05)] opacity-60"
                          : "border-white/8 bg-[var(--color-panel)]"
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium">{request.title}</div>
                        <div className="mt-1 text-xs text-[var(--color-muted)]">
                          {request.customer} · {request.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-lg text-[var(--color-gold)]">
                          {request.amount}
                        </div>
                        <div className="text-[10px] text-[var(--color-muted)]">
                          {request.days}
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      {request.details.map((detail) => (
                        <span
                          key={detail}
                          className="rounded-md bg-white/4 px-2.5 py-1 text-[11px] text-[var(--color-muted)]"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setRequests((current) =>
                            current.map((item) =>
                              item.id === request.id
                                ? { ...item, status: "accepted" }
                                : item,
                            ),
                          )
                        }
                        className="flex-1 rounded-lg border border-[rgba(62,207,142,0.3)] bg-[rgba(62,207,142,0.1)] px-3 py-2 text-sm text-[#3ECF8E]"
                      >
                        ✓ Зөвшөөрөх
                      </button>
                      <button
                        onClick={() =>
                          setRequests((current) =>
                            current.map((item) =>
                              item.id === request.id
                                ? { ...item, status: "declined" }
                                : item,
                            ),
                          )
                        }
                        className="flex-1 rounded-lg border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.08)] px-3 py-2 text-sm text-[#F87171]"
                      >
                        ✕ Татгалзах
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[var(--color-surface)]">
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                <div className="font-display text-sm font-bold">Аялалын түүх</div>
                <span className="text-xs text-[var(--color-gold)]">Бүгд харах</span>
              </div>
              <div className="p-5">
                {driverDashboardData.history.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 border-b border-white/4 py-3 last:border-b-0"
                  >
                    <div className="h-2 w-2 rounded-full bg-[#3ECF8E]" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-[var(--color-muted)]">{item.meta}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[var(--color-gold)]">
                        {item.amount}
                      </div>
                      <div className="mt-1 text-[10px] text-[#3ECF8E]">{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="font-display text-sm font-bold">7 хоногийн орлого</div>
                <div className="text-sm font-medium text-[var(--color-gold)]">
                  {driverDashboardData.driver.monthlyIncome}
                </div>
              </div>
              <div className="flex h-24 items-end gap-2">
                {driverDashboardData.earnings.map((item) => (
                  <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      style={{ height: item.height }}
                      className={`w-full rounded-t-md ${
                        item.current
                          ? "bg-[var(--color-gold)]"
                          : "bg-[rgba(201,168,76,0.22)]"
                      }`}
                    />
                    <span
                      className={`text-[10px] ${
                        item.current
                          ? "text-[var(--color-gold)]"
                          : "text-[var(--color-muted)]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Хүлээн авалт", value: driverDashboardData.driver.acceptanceRate, color: "#3ECF8E" },
                { label: "Цагт ирэлт", value: driverDashboardData.driver.onTimeRate, color: "#60A5FA" },
                { label: "Нийт аялал", value: String(driverDashboardData.driver.trips), color: "var(--color-gold)" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/8 bg-[var(--color-surface)] p-4 text-center"
                >
                  <div
                    className="font-display text-2xl font-bold"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[10px] text-[var(--color-muted)]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="font-display text-sm font-bold">Миний үнэлгээ</div>
                <Link href="/driver/profile" className="text-xs text-[var(--color-gold)]">
                  Профайл
                </Link>
              </div>
              <div className="text-center">
                <div className="font-display text-5xl font-extrabold text-[var(--color-gold)]">
                  {driverDashboardData.driver.rating}
                </div>
                <div className="mt-1 text-lg text-[var(--color-gold)]">★★★★★</div>
                <div className="mt-2 text-xs text-[var(--color-muted)]">
                  {driverDashboardData.driver.reviewCount} үнэлгээ
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="font-display text-sm font-bold">Миний машин</div>
                <Link href="/driver/profile" className="text-xs text-[var(--color-gold)]">
                  Засах
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-4xl">🚙</div>
                <div>
                  <div className="font-display text-base font-bold">
                    {driverDashboardData.car.name}
                  </div>
                  <div className="mt-1 text-xs text-[var(--color-muted)]">
                    {driverDashboardData.car.meta}
                  </div>
                  <div className="mt-2 text-[11px] text-[#3ECF8E]">
                    {driverDashboardData.car.status}
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-white/8 bg-[var(--color-panel)] p-3 text-xs text-[var(--color-muted)]">
                {displayEmail}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
