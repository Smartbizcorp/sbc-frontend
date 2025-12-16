"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Clé localStorage (versionnable)
const LS_KEY = "sbc_translate_cache_v1";

type TranslateParams = {
  text: string;
  from?: string; // ex: "fr"
  to: string;    // ex: "en"
  enabled?: boolean;
};

type TranslateState = {
  translated: string;
  loading: boolean;
  error: string | null;
  cached: boolean;
};

type CacheEntry = {
  v: string;      // translated
  t: number;      // timestamp
};

function makeKey(from: string, to: string, text: string) {
  // clé stable (simple)
  return `${from}→${to}::${text}`;
}

function loadLocalCache(): Record<string, CacheEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function saveLocalCache(cache: Record<string, CacheEntry>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(cache));
  } catch {
    // ignore quota
  }
}

/**
 * useAutoTranslate
 * - traduit automatiquement via backend /api/i18n/translate
 * - cache client (memo + localStorage)
 */
export function useAutoTranslate({
  text,
  from = "fr",
  to,
  enabled = true,
}: TranslateParams): TranslateState {
  const [state, setState] = useState<TranslateState>({
    translated: text ?? "",
    loading: false,
    error: null,
    cached: false,
  });

  // cache mémoire (par session)
  const memCache = useRef<Map<string, string>>(new Map());

  const fromNorm = (from || "fr").trim().toLowerCase();
  const toNorm = (to || "").trim().toLowerCase();
  const srcText = (text || "").trim();

  const cacheKey = useMemo(
    () => makeKey(fromNorm, toNorm, srcText),
    [fromNorm, toNorm, srcText]
  );

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // base cases
      if (!enabled || !srcText || !toNorm) {
        setState({ translated: srcText, loading: false, error: null, cached: true });
        return;
      }

      // même langue => pas besoin
      if (fromNorm === toNorm) {
        setState({ translated: srcText, loading: false, error: null, cached: true });
        return;
      }

      // 1) cache mémoire
      const memHit = memCache.current.get(cacheKey);
      if (memHit) {
        setState({ translated: memHit, loading: false, error: null, cached: true });
        return;
      }

      // 2) cache localStorage
      const localCache = loadLocalCache();
      const localHit = localCache[cacheKey]?.v;
      if (localHit) {
        memCache.current.set(cacheKey, localHit);
        setState({ translated: localHit, loading: false, error: null, cached: true });
        return;
      }

      // 3) call backend
      setState((s) => ({ ...s, loading: true, error: null, cached: false }));

      try {
        const res = await fetch(`${API_BASE_URL}/api/i18n/translate`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceText: srcText,
            sourceLocale: fromNorm,
            targetLocale: toNorm,
          }),
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `Erreur API (${res.status})`);
        }

        const json: any = await res.json();
        const translated = String(json?.translated ?? srcText);

        if (cancelled) return;

        // save caches
        memCache.current.set(cacheKey, translated);

        const nextLocal = loadLocalCache();
        nextLocal[cacheKey] = { v: translated, t: Date.now() };
        saveLocalCache(nextLocal);

        setState({
          translated,
          loading: false,
          error: null,
          cached: Boolean(json?.cached),
        });
      } catch (e: any) {
        if (cancelled) return;
        setState({
          translated: srcText, // fallback
          loading: false,
          error: e?.message || "Erreur traduction",
          cached: false,
        });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [cacheKey, enabled, srcText, fromNorm, toNorm]);

  return state;
}
