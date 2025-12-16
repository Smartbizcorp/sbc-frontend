"use client";

import { useEffect, useState } from "react";
import { getLocaleClient, setLocaleClient, normalizeLocale, type SupportedLocale } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

export function useLocale() {
  const [locale, setLocale] = useState<SupportedLocale>(() => getLocaleClient());

  // sync si l’utilisateur change via un autre onglet
  useEffect(() => {
    const handler = () => setLocale(getLocaleClient());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  function changeLocale(next: string) {
    const normalized = normalizeLocale(next);
    setLocale(normalized);
    setLocaleClient(normalized);

    // tracking (optionnel)
    trackEvent("locale_change", { locale: normalized });
  }

  return { locale, setLocale: changeLocale };
}
