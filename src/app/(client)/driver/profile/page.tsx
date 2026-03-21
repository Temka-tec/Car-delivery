"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

import { driverDashboardData } from "../_components/driver-dashboard-data";

export default function DriverProfilePage() {
  const { user } = useUser();

  const displayName =
    user?.fullName || user?.firstName || driverDashboardData.driver.name;
  const displayEmail =
    user?.primaryEmailAddress?.emailAddress || driverDashboardData.driver.email;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-6 py-8 text-[var(--color-text)] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-display text-3xl font-extrabold tracking-[-0.04em]">
              Жолоочийн профайл
            </div>
            <div className="mt-2 text-sm text-[var(--color-muted)]">
              Таны хувийн мэдээлэл, үнэмлэх, машины мэдээлэл
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/driver/dashboard"
              className="rounded-xl border border-white/8 px-5 py-3 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
            >
              ← Dashboard
            </Link>
            <SignOutButton>
              <button className="rounded-xl border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.08)] px-5 py-3 text-sm text-[#F87171] transition hover:bg-[rgba(248,113,113,0.14)]">
                Гарах
              </button>
            </SignOutButton>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.12)] font-display text-2xl font-bold text-[var(--color-gold)]">
                {displayName.charAt(0)}
              </div>
              <div className="mt-4 font-display text-2xl font-bold">{displayName}</div>
              <div className="mt-1 text-sm text-[var(--color-muted)]">{displayEmail}</div>
              <div className="mt-3 rounded-full border border-[rgba(62,207,142,0.25)] bg-[rgba(62,207,142,0.1)] px-3 py-1 text-xs text-[#3ECF8E]">
                ● {driverDashboardData.driver.status}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Үнэлгээ", value: driverDashboardData.driver.rating },
                { label: "Аялал", value: String(driverDashboardData.driver.trips) },
                { label: "Орлого", value: driverDashboardData.driver.monthlyIncome },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-3"
                >
                  <div className="font-display text-lg font-bold text-[var(--color-gold)]">
                    {item.value}
                  </div>
                  <div className="mt-1 text-[10px] text-[var(--color-muted)]">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 font-display text-lg font-bold">Хувийн мэдээлэл</div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Нэр", value: displayName },
                  { label: "Утас", value: driverDashboardData.driver.phone },
                  { label: "И-мэйл", value: displayEmail },
                  { label: "Төлөв", value: driverDashboardData.driver.status },
                ].map((field) => (
                  <div key={field.label} className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4">
                    <div className="text-xs text-[var(--color-muted)]">{field.label}</div>
                    <div className="mt-2 text-sm font-medium">{field.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 font-display text-lg font-bold">Жолооны үнэмлэх</div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Үнэмлэхийн дугаар", value: driverDashboardData.driver.license.number },
                  { label: "Ангилал", value: driverDashboardData.driver.license.class },
                  { label: "Дуусах огноо", value: driverDashboardData.driver.license.expiry },
                  { label: "Туршлага", value: driverDashboardData.driver.license.experience },
                ].map((field) => (
                  <div key={field.label} className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4">
                    <div className="text-xs text-[var(--color-muted)]">{field.label}</div>
                    <div className="mt-2 text-sm font-medium">{field.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 font-display text-lg font-bold">Машины мэдээлэл</div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/8 bg-[var(--color-panel)] text-5xl">
                  🚙
                </div>
                <div className="flex-1">
                  <div className="font-display text-xl font-bold">
                    {driverDashboardData.car.name}
                  </div>
                  <div className="mt-2 text-sm text-[var(--color-muted)]">
                    {driverDashboardData.car.meta}
                  </div>
                  <div className="mt-3 inline-flex rounded-full border border-[rgba(62,207,142,0.25)] bg-[rgba(62,207,142,0.1)] px-3 py-1 text-xs text-[#3ECF8E]">
                    {driverDashboardData.car.status}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
