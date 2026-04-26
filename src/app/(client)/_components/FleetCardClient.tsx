"use client";

import type { ReactNode } from "react";
import { useCardGlow } from "@/hooks/use-card-glow";

/**
 * FleetCardClient — card-glow mouse tracking-ийг client side-д хийнэ.
 * className="block" ашиглана — "contents" нь onMouseMove-ийн
 * currentTarget-ийн getBoundingClientRect()-г эвдэнэ.
 */
export function FleetCardClient({ children }: { children: ReactNode }) {
  const cardGlow = useCardGlow();

  return (
    <div onMouseMove={cardGlow} className="block">
      {children}
    </div>
  );
}
