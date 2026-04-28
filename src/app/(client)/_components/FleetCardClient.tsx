"use client";

import type { ReactNode } from "react";
import { useCardGlow } from "@/hooks/use-card-glow";

export function FleetCardClient({ children }: { children: ReactNode }) {
  const cardGlow = useCardGlow();

  return (
    <div onMouseMove={cardGlow} className="block">
      {children}
    </div>
  );
}
