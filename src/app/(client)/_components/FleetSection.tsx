"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

import { cars } from "./landing-data";

const iconShellClasses =
  "flex h-36 items-center justify-center bg-[linear-gradient(135deg,#1A1A26,#22222E)]";

export const FleetSection = () => {
  const { isLoaded, userId } = useAuth();
  const isSignedIn = isLoaded && Boolean(userId);

  return (
    <section id="cars" className="px-6 py-14 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-text)]">
            Сул байгаа <span className="text-[var(--color-gold)]">машинууд</span>
          </div>
          <a
            href="#cars"
            className="w-fit border-b border-[rgba(201,168,76,0.3)] pb-0.5 text-sm text-[var(--color-gold)]"
          >
            Бүгдийг харах
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cars.map((car) => (
            <article
              key={car.name}
              className="overflow-hidden rounded-[20px] border border-white/8 bg-[var(--color-surface)] transition hover:-translate-y-1 hover:border-[rgba(201,168,76,0.25)]"
            >
              <div className={`${iconShellClasses} relative`}>
                <div className="font-display text-4xl font-extrabold tracking-[0.12em] text-white/80">
                  {car.icon}
                </div>
                <div
                  className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-[10px] tracking-[0.04em] ${car.badgeClassName}`}
                >
                  {car.badge}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-[var(--color-text)]">
                  {car.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  {car.detail}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {car.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-[var(--color-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="font-display text-xl font-bold text-[var(--color-gold)]">
                    {car.price}
                    <span className="ml-1 font-sans text-xs font-normal text-[var(--color-muted)]">
                      / өдөр
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link
                      href={`/cars/${car.slug}`}
                      className="rounded-lg border border-[rgba(201,168,76,0.28)] px-4 py-2 text-sm font-medium text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.08)]"
                    >
                      Дэлгэрэнгүй
                    </Link>
                    {!isSignedIn ? (
                      <Link
                        href="/sign-in"
                        className="rounded-lg bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
                      >
                        Нэвтрэх
                      </Link>
                    ) : (
                      <Link
                        href="/booking"
                        className="rounded-lg bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
                      >
                        Захиалах
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
