"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

import { DriverRegistrationDialog } from "./DriverRegistrationDialog";
import { driverSteps } from "./landing-data";

export const DriverCTA = () => {
  const { isLoaded, userId } = useAuth();
  const isSignedIn = isLoaded && Boolean(userId);

  return (
    <section id="drivers" className="px-6 py-14 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 rounded-[20px] border border-[rgba(201,168,76,0.2)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-panel))] p-8 lg:flex-row lg:items-center lg:p-10">
          <div className="text-5xl leading-none">👨‍✈️</div>

          <div className="max-w-3xl">
            <h2 className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-text)]">
              Жолоочоор ажиллахыг хүсч байна уу?
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)] sm:text-base">
              Эхлээд хэрэглэгчээр бүртгүүлэн, дараа нь профайлаасаа жолооч
              болох хүсэлт гаргаарай.
            </p>

            <div className="mt-6 grid gap-3">
              {driverSteps.map((step) => (
                <div
                  key={step}
                  className="flex items-start gap-3 text-sm text-[var(--color-text)]"
                >
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <DriverRegistrationDialog
                label="Жолооч болох →"
                className="rounded-lg bg-[var(--color-gold)] px-5 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
              />
              {!isSignedIn ? (
                <Link
                  href="/sign-in"
                  className="rounded-lg border border-[rgba(201,168,76,0.4)] px-5 py-3 text-sm text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.1)]"
                >
                  Нэвтрэх
                </Link>
              ) : (
                <Link
                  href="/driver/dashboard"
                  className="rounded-lg border border-[rgba(201,168,76,0.25)] px-5 py-3 text-sm text-[var(--color-muted)] transition hover:border-[rgba(201,168,76,0.4)] hover:text-[var(--color-text)]"
                >
                  Dashboard харах
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
