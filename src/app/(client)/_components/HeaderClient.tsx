"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

import { navItems } from "./landing-data";

type HeaderClientProps = {
  isAdmin: boolean;
};

export const HeaderClient = ({ isAdmin }: HeaderClientProps) => {
  const { isLoaded, user } = useUser();
  const userId = user?.id;
  const isSignedIn = isLoaded && Boolean(userId);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[var(--color-header-bg)] backdrop-blur">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="font-display text-xl font-extrabold tracking-[-0.04em] text-[var(--color-text)] sm:text-2xl"
          >
            ALPHARD<span className="text-[var(--color-gold)]">.</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-[var(--color-muted)] transition hover:text-[var(--color-gold)]"
              >
                {item.label}
              </a>
            ))}
            {isAdmin ? (
              <Link
                href="/admin/driver-applications"
                className="text-sm font-medium text-[var(--color-gold)] transition hover:text-[var(--color-gold-light)]"
              >
                Админ
              </Link>
            ) : null}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            {!isSignedIn ? (
              <>
                <Link
                  href="/sign-in"
                  className="rounded-lg border border-[rgba(201,168,76,0.4)] px-4 py-2 text-sm text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.1)]"
                >
                  Нэвтрэх
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-lg bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
                >
                  Бүртгүүлэх
                </Link>
              </>
            ) : (
              <>
                {isAdmin ? (
                  <Link
                    href="/admin/driver-applications"
                    className="rounded-lg border border-[rgba(201,168,76,0.4)] px-4 py-2 text-sm text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.1)]"
                  >
                    Admin
                  </Link>
                ) : null}
                <Link
                  href="/booking"
                  className="rounded-lg bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
                >
                  Захиалах
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10 ring-1 ring-[rgba(201,168,76,0.3)]",
                    },
                  }}
                />
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="rounded-lg border border-white/10 px-3 py-2 text-sm text-[var(--color-text)]"
              aria-label="Menu нээх"
            >
              {isMenuOpen ? "Хаах" : "Цэс"}
            </button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="mt-4 rounded-2xl border border-white/8 bg-[var(--color-surface)] p-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-panel)] hover:text-[var(--color-gold)]"
                >
                  {item.label}
                </a>
              ))}
              {isAdmin ? (
                <Link
                  href="/admin/driver-applications"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-gold)] transition hover:bg-[var(--color-panel)]"
                >
                  Админ
                </Link>
              ) : null}
            </nav>

            <div className="mt-4 grid gap-2">
              {!isSignedIn ? (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg border border-[rgba(201,168,76,0.4)] px-4 py-3 text-center text-sm text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.1)]"
                  >
                    Нэвтрэх
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg bg-[var(--color-gold)] px-4 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
                  >
                    Бүртгүүлэх
                  </Link>
                </>
              ) : (
                <>
                  {isAdmin ? (
                    <Link
                      href="/admin/driver-applications"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-lg border border-[rgba(201,168,76,0.4)] px-4 py-3 text-center text-sm text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.1)]"
                    >
                      Admin
                    </Link>
                  ) : null}
                  <Link
                    href="/booking"
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-lg bg-[var(--color-gold)] px-4 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
                  >
                    Захиалах
                  </Link>
                  <div className="pt-2">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "h-10 w-10 ring-1 ring-[rgba(201,168,76,0.3)]",
                        },
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
};
