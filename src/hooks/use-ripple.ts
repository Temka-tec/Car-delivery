"use client";

import type { MouseEvent } from "react";
import { useCallback } from "react";

export function useRipple() {
  return useCallback((e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const circle = document.createElement("span");
    circle.className = "ripple-circle";
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 620);
  }, []);
}
