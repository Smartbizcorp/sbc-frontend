"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { useLang } from "@/lib/i18n-provider";

type State = { text: string; loading: boolean; error?: string };

function stableKey(locale: string, source: string) {
  let h = 5381;
  const s = `${locale}::${source}`;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return `sbc_i18n_v1:${locale}:${(h >>> 0).toString(16)}`;
}

// ✅ cache mémoire + anti-doublons
const memCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

function getTranslateBase() {
  // 1) URL explicite si tu l’as
  const direct = process.env.NEXT_PUBLIC_TRANSLATE_URL;
  if (direct) return direct;

  // 2) Sinon backend API URL
  const api = process.env.NEXT_PUBLIC_API_URL;
  if (api) return `${api.replace(/\/$/, "")}/api/i18n/translate`;

  // 3) Sinon fallback même origine (si tu as une route Next qui proxy)
  if (typeof window !== "undefined") return `${window.location.origin}/api/i18n/translate`;

  return "/api/i18n/translate";
}

async function callTranslateApi(
  sourceText: string,
  targetLocale: string,
  sourceLocale: string
) {
  const base = getTranslateBase();

  const res = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // ✅ si ton backend est sur un autre domaine + cookies
    credentials: "include",
    body: JSON.stringify({ sourceText, sourceLocale, targetLocale }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`translate failed: ${res.status} ${t || ""}`.trim());
  }

  const json = (await res.json()) as { translated?: string };
  return (json.translated ?? sourceText).toString();
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

    // ✅ si on est en locale source → retour direct
    if (!locale || locale === DEFAULT_LOCALE) {
      setState({ text: normalized, loading: false });
      return;
    }

    const key = stableKey(locale, normalized);

    // 0) cache mémoire
    const memHit = memCache.get(key);
    if (memHit) {
      setState({ text: memHit, loading: false });
      return;
    }

    // 1) cache localStorage
    if (typeof window !== "undefined") {
      const hit = window.localStorage.getItem(key);
      if (hit) {
        memCache.set(key, hit);
        setState({ text: hit, loading: false });
        return;
      }
    }

    const reqId = ++lastReq.current;
    setState({ text: normalized, loading: true });

    // 2) anti-doublon inflight
    let p = inflight.get(key);
    if (!p) {
      p = callTranslateApi(normalized, locale, DEFAULT_LOCALE)
        .then((translated) => {
          memCache.set(key, translated);
          if (typeof window !== "undefined") window.localStorage.setItem(key, translated);
          return translated;
        })
        .finally(() => inflight.delete(key));
      inflight.set(key, p);
    }

    p.then((translated) => {
      if (reqId !== lastReq.current) return;
      setState({ text: translated, loading: false });
    }).catch((e: any) => {
      if (reqId !== lastReq.current) return;
      setState({ text: normalized, loading: false, error: e?.message || "translate error" });
    });
  }, [locale, normalized]);

  return state; // { text, loading, error }
}
