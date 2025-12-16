"use client";

import React from "react";
import { useAutoTranslate } from "@/lib/useAutoTranslate";

/**
 * Usage:
 *   <T>Accueil</T>
 *   <button><T>S'inscrire</T></button>
 */
export function T({ children }: { children: React.ReactNode }) {
  // on ne traduit que les strings simples
  const raw = typeof children === "string" ? children : null;
  const { text } = useAutoTranslate(raw ?? "");

  if (raw === null) return <>{children}</>;

  // évite les warnings hydratation (serveur FR -> client traduit)
  return (
    <span suppressHydrationWarning>
      {text}
    </span>
  );
}
