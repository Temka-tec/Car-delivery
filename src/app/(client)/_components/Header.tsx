"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

import { navItems } from "./landing-data";

export const Header = () => {
  const { isLoaded, userId } = useAuth();
  const isSignedIn = isLoaded && Boolean(userId);

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[var(--color-header-bg)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-10">
        <Link
          href="/"
          className="font-display text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-text)]"
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
        </nav>

        <div className="flex items-center gap-3">
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
      </div>
    </header>
  );
};
