"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { useLang } from "@/lib/i18n-provider";

type State = { text: string; loading: boolean; error?: string };

function stableKey(locale: string, source: string) {
  // clé stable simple (évite crypto)
  let h = 5381;
  const s = `${locale}::${source}`;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return `sbc_i18n_v1:${locale}:${(h >>> 0).toString(16)}`;
}

async function callTranslateApi(sourceText: string, targetLocale: string, sourceLocale = "fr") {
  const base =
    process.env.NEXT_PUBLIC_TRANSLATE_URL ||
    `${process.env.NEXT_PUBLIC_API_URL || ""}/api/i18n/translate`;

  const res = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sourceText, sourceLocale, targetLocale }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`translate failed: ${res.status} ${t || ""}`.trim());
  }

  const json = (await res.json()) as { translated?: string };
  return json.translated ?? sourceText;
}

export function useAutoTranslate(sourceText: string) {
  const { locale } = useLang();

  const normalized = useMemo(() => (sourceText ?? "").trim(), [sourceText]);
  const [state, setState] = useState<State>({ text: normalized, loading: false });
  const lastReq = useRef(0);

  useEffect(() => {
    if (!normalized) {
      setState({ text: "", loading: false });
      return;
    }

    // FR (source) => pas de call
    if (!locale || locale === DEFAULT_LOCALE) {
      setState({ text: normalized, loading: false });
      return;
    }

    const key = stableKey(locale, normalized);

    // cache localStorage (ultra rapide)
    if (typeof window !== "undefined") {
      const hit = window.localStorage.getItem(key);
      if (hit) {
        setState({ text: hit, loading: false });
        return;
      }
    }

    const reqId = ++lastReq.current;
    setState((p) => ({ ...p, loading: true, error: undefined }));

    (async () => {
      try {
        const translated = await callTranslateApi(normalized, locale, DEFAULT_LOCALE);
        if (reqId !== lastReq.current) return;

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, translated);
        }

        setState({ text: translated, loading: false });
      } catch (e: any) {
        if (reqId !== lastReq.current) return;
        setState({ text: normalized, loading: false, error: e?.message || "translate error" });
      }
    })();
  }, [locale, normalized]);

  return state; // { text, loading, error }
}
