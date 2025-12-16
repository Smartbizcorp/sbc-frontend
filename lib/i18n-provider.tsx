"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LOCALE,
  type SupportedLocale,
  getLocaleClient,
  normalizeLocale,
  setLocaleClient,
} from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

type LangContextValue = {
  locale: SupportedLocale;
  setLocale: (l: string) => void;
};

const LangContext = createContext<LangContextValue | null>(null);

function getLangFromQuery(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get("lang");
  } catch {
    return null;
  }
}

function setLangInQuery(locale: string) {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", locale);
    // ✅ pas de navigation Next.js, pas de SSR bailout
    window.history.replaceState(null, "", url.toString());
  } catch {
    // ignore
  }
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);

  // init (storage/cookie) + override via ?lang=
  useEffect(() => {
    const fromStorage = getLocaleClient();
    const q = getLangFromQuery();
    const normalized = normalizeLocale(q || fromStorage);

    setLocaleClient(normalized);
    setLocaleState(normalized);
  }, []);

  const setLocale = (l: string) => {
    const normalized = normalizeLocale(l);
    setLocaleClient(normalized);
    setLocaleState(normalized);

    // garder ?lang=xx dans l’URL (partage) sans casser le build
    setLangInQuery(normalized);

    // tracking (optionnel)
    trackEvent("locale_change", { locale: normalized });
  };

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang() must be used inside <LangProvider>.");
  return ctx;
}
