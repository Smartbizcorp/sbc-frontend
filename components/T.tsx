"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { useLang } from "@/lib/i18n-provider";

/**
 * ✅ Usage
 *   <T>Accueil</T>
 *   <button><T>S'inscrire</T></button>
 *
 * ✅ Traduction "string" via hook
 *   const { tr } = useTr();
 *   <input placeholder={tr("Mot de passe sécurisé")} />
 */

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
  sourceLocale = DEFAULT_LOCALE
) {
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

/* =========================
   Cache mémoire
========================= */
const memCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

/* =========================
   ✅ Hook : useTr() → tr("...")
========================= */
export function useTr() {
  const { locale } = useLang();

  const [, force] = useState(0);
  const pendingRef = useRef<Set<string>>(new Set());

  const normalize = useCallback((s: string) => (s ?? "").trim(), []);

  const tr = useCallback(
    (sourceText: string) => {
      const src = normalize(sourceText);
      if (!src) return "";
      if (!locale || locale === DEFAULT_LOCALE) return src;

      const key = stableKey(locale, src);

      const memHit = memCache.get(key);
      if (memHit) return memHit;

      if (typeof window !== "undefined") {
        const lsHit = window.localStorage.getItem(key);
        if (lsHit) {
          memCache.set(key, lsHit);
          return lsHit;
        }
      }

      
      pendingRef.current.add(src);
      return src;
    },
    [locale, normalize]
  );

  useEffect(() => {
    
    if (!locale || locale === DEFAULT_LOCALE) return;

    const list = Array.from(pendingRef.current);
    pendingRef.current.clear();
    if (list.length === 0) return;

    let canceled = false;

    (async () => {
      for (const src of list) {
        const key = stableKey(locale, src);

        if (memCache.has(key)) continue;


        let p = inflight.get(key);
        if (!p) {
          p = callTranslateApi(src, locale, DEFAULT_LOCALE)
            .then((translated) => {
              memCache.set(key, translated);
              if (typeof window !== "undefined") {
                window.localStorage.setItem(key, translated);
              }
              return translated;
            })
            .finally(() => {
              inflight.delete(key);
            });
          inflight.set(key, p);
        }

        try {
          await p;
          if (canceled) return;
          force((x) => x + 1);
        } catch {
          // ignore
        }
      }
    })();

    return () => {
      canceled = true;
    };
  }, [locale]);

  return { tr, locale };
}

/* =========================
   ✅ <T> branché sur LangProvider
========================= */
export function T({ children }: { children: React.ReactNode }) {
  const raw = typeof children === "string" ? children : null;
  const { tr } = useTr();

  if (raw === null) return <>{children}</>;
  return <span suppressHydrationWarning>{tr(raw)}</span>;
}
