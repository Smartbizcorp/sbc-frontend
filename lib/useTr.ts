"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { useLang } from "@/lib/i18n-provider";

/* =========================
   Helpers
========================= */
function stableKey(locale: string, source: string) {
  let h = 5381;
  const s = `${locale}::${source}`;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return `sbc_i18n_v1:${locale}:${(h >>> 0).toString(16)}`;
}

async function callTranslateApi(
  sourceText: string,
  targetLocale: string,
  sourceLocale: string
) {
  const base =
    process.env.NEXT_PUBLIC_TRANSLATE_URL ||
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/i18n/translate`;

  const res = await fetch(base, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sourceText, sourceLocale, targetLocale }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(t || `Translation failed (${res.status})`);
  }

  const json = (await res.json()) as { translated?: string };
  return json.translated ?? sourceText;
}

/* =========================
   Cache
========================= */
const memCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

export function useTr() {
  const { locale } = useLang();

  // tick pour forcer un re-render quand une traduction arrive
  const [, force] = useState(0);

  // textes demandés pendant le render
  const pending = useRef<Set<string>>(new Set());

  const tr = useCallback(
    (sourceText: string) => {
      const src = (sourceText ?? "").trim();
      if (!src) return "";

      // si langue source
      if (!locale || locale === DEFAULT_LOCALE) return src;

      const key = stableKey(locale, src);

      // 1) cache mémoire
      const mem = memCache.get(key);
      if (mem) return mem;

      // 2) cache localStorage
      if (typeof window !== "undefined") {
        const ls = localStorage.getItem(key);
        if (ls) {
          memCache.set(key, ls);
          return ls;
        }
      }

      // 3) planifier traduction
      pending.current.add(src);
      return src;
    },
    [locale]
  );

  useEffect(() => {
    if (!locale || locale === DEFAULT_LOCALE) return;
    if (pending.current.size === 0) return;

    const texts = Array.from(pending.current);
    pending.current.clear();

    texts.forEach((src) => {
      const key = stableKey(locale, src);
      if (memCache.has(key)) return;

      let p = inflight.get(key);

      if (!p) {
        p = callTranslateApi(src, locale, DEFAULT_LOCALE)
          .then((translated) => {
            memCache.set(key, translated);

            if (typeof window !== "undefined") {
              localStorage.setItem(key, translated);
            }

            force((n) => n + 1); // re-render
            return translated; // ✅ Promise<string>
          })
          .catch(() => {
            // ✅ fallback sans casser Promise<string>
            return src;
          })
          .finally(() => {
            inflight.delete(key);
          });

        inflight.set(key, p);
      }
    });
  }, [locale]); // ok

  return { tr, locale };
}
