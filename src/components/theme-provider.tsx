"use client";

import {
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

const storageKey = "theme";
const listeners = new Set<() => void>();

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getSystemTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const getClientTheme = (): Theme | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedTheme = window.localStorage.getItem(storageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return getSystemTheme();
};

const getServerSnapshot = () => null;

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const syncTheme = () => {
      const theme = getClientTheme();

      if (theme) {
        applyTheme(theme);
        emitChange();
      }
    };

    syncTheme();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      if (!window.localStorage.getItem(storageKey)) {
        syncTheme();
      }
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey) {
        syncTheme();
      }
    };

    media.addEventListener("change", handleMediaChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      media.removeEventListener("change", handleMediaChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return <>{children}</>;
}

export const useTheme = () => {
  const resolvedTheme = useSyncExternalStore(
    subscribe,
    getClientTheme,
    getServerSnapshot,
  );

  return {
    resolvedTheme,
    setTheme: (theme: Theme) => {
      window.localStorage.setItem(storageKey, theme);
      applyTheme(theme);
      emitChange();
    },
  };
};
