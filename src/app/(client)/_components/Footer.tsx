"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export const Footer = () => {
  const { isLoaded, userId } = useAuth();
  const isSignedIn = isLoaded && Boolean(userId);

  return (
    <footer
      id="about"
      className="border-t border-white/6 bg-[var(--color-bg)] px-6 py-10 text-center lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="font-display text-xl font-extrabold tracking-[-0.04em] text-[var(--color-text)]">
          ALPHARD<span className="text-[var(--color-gold)]">.</span>
        </div>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Жолоочтой машин түрээслэлийн платформ · Монгол
        </p>
        {!isSignedIn ? (
          <Link
            href="/sign-in"
            className="mt-4 inline-flex items-center justify-center gap-2 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-gold)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,168,76,0.5)]" />
            <span>Clerk нэвтрэх</span>
          </Link>
        ) : (
          <div className="mt-4 inline-flex items-center justify-center gap-2 text-sm text-[var(--color-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3ECF8E]" />
            <span>Та нэвтэрсэн байна</span>
          </div>
        )}
      </div>
    </footer>
  );
};
