"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_LOCALE,
  SupportedLocale,
  getLocaleClient,
  normalizeLocale,
  setLocaleClient,
} from "@/lib/i18n";

type LangContextValue = {
  locale: SupportedLocale;
  setLocale: (l: string) => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [locale, setLocaleState] = useState<SupportedLocale>(DEFAULT_LOCALE);

  // init (storage/cookie/?lang)
  useEffect(() => {
    setLocaleState(getLocaleClient());
  }, []);

  // sync URL ?lang=xx
  useEffect(() => {
    const q = searchParams?.get("lang");
    if (!q) return;

    const normalized = normalizeLocale(q);
    setLocaleClient(normalized);
    setLocaleState(normalized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.get("lang")]);

  const setLocale = (l: string) => {
    const normalized = normalizeLocale(l);
    setLocaleClient(normalized);
    setLocaleState(normalized);

    // garder ?lang=xx dans l’URL (partage)
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("lang", normalized);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang() must be used inside <LangProvider>.");
  return ctx;
}
