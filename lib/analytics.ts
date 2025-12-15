"use client";

import { track } from "@vercel/analytics";

type Props = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(name: string, props?: Props) {
  try {
    track(name, props);
  } catch {
    // no-op (évite crash si bloqué)
  }
}
