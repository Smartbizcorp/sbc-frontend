"use client";

import React from "react";
import { useTr } from "@/lib/useTr";

/**
 * Usage:
 *  <T>Accueil</T>
 *  <button><T>S'inscrire</T></button>
 */
export function T({ children }: { children: React.ReactNode }) {
  const raw = typeof children === "string" ? children : null;
  const { tr } = useTr();

  if (raw === null) return <>{children}</>;
  return <span suppressHydrationWarning>{tr(raw)}</span>;
}
