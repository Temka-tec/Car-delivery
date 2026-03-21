"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  if (!resolvedTheme) {
    return (
      <button
        type="button"
        aria-label="Theme солих"
        className="rounded-lg border border-white/10 px-3 py-2 text-sm text-[var(--color-muted)]"
      >
        Theme
      </button>
    );
  }

  const isDark = resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Theme солих"
      className="rounded-lg border border-white/10 bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] transition hover:border-[rgba(201,168,76,0.4)] hover:text-[var(--color-gold)]"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
