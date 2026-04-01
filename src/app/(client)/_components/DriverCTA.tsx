import Link from "next/link";

import { getCurrentViewer } from "@/lib/current-viewer";
import { DriverRegistrationDialog } from "./DriverRegistrationDialog";
import { driverSteps } from "./landing-data";

export const DriverCTA = async () => {
  const viewer = await getCurrentViewer();

  return (
    <section id="drivers" className="px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 rounded-[20px] border border-[rgba(201,168,76,0.2)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-panel))] p-6 sm:p-8 lg:flex-row lg:items-center lg:p-10">
          <div className="text-4xl leading-none sm:text-5xl">👨‍✈️</div>

          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-text)] sm:text-3xl">
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

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {viewer.isDriver ? (
                <Link
                  href="/driver/profile"
                  className="rounded-lg bg-[var(--color-gold)] px-5 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
                >
                  Жолоочийн профайл
                </Link>
              ) : viewer.hasDriverApplication ? (
                <Link
                  href="/driver/dashboard"
                  className="rounded-lg bg-[var(--color-gold)] px-5 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
                >
                  Хүсэлтийн төлөв
                </Link>
              ) : (
                <DriverRegistrationDialog
                  label="Жолоочийн хүсэлт →"
                  className="rounded-lg bg-[var(--color-gold)] px-5 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
                />
              )}
              {!viewer.isSignedIn ? (
                <Link
                  href="/sign-in"
                  className="rounded-lg border border-[rgba(201,168,76,0.4)] px-5 py-3 text-center text-sm text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.1)]"
                >
                  Нэвтрэх
                </Link>
              ) : (
                <Link
                  href={viewer.isDriver ? "/driver/profile" : "/driver/dashboard"}
                  className="rounded-lg border border-[rgba(201,168,76,0.25)] px-5 py-3 text-center text-sm text-[var(--color-muted)] transition hover:border-[rgba(201,168,76,0.4)] hover:text-[var(--color-text)]"
                >
                  {viewer.isDriver ? "Dashboard" : "Хүсэлтийн самбар"}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
