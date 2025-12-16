"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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

export function LangProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);

  // init (storage/cookie)
  useEffect(() => {
    setLocaleState(getLocaleClient());
  }, []);

  // init (optionnel) depuis ?lang=xx SANS useSearchParams
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("lang");
    if (!q) return;

    const normalized = normalizeLocale(q);
    setLocaleClient(normalized);
    setLocaleState(normalized);
  }, []);

  const setLocale = (l: string) => {
    const normalized = normalizeLocale(l);
    setLocaleClient(normalized);
    setLocaleState(normalized);

    // garder ?lang=xx dans l'URL (partage) sans casser
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("lang", normalized);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      router.refresh();
    }

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
