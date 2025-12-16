"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { useLang } from "@/lib/i18n-provider";
import { useAutoTranslate } from "@/lib/useAutoTranslate";

/**
 * ✅ Usage actuel (inchangé)
 *   <T>Accueil</T>
 *   <button><T>S'inscrire</T></button>
 *
 * ✅ Nouveau : traduction "string" via fonction tr()
 *   const { tr } = useTr();
 *   <input placeholder={tr("Mot de passe sécurisé")} />
 *   <option>{tr("Sélectionnez une question")}</option>
 *   <span aria-label={tr("Fermer")}>...</span>
 */

/* =========================
   Helpers (copiés de ton hook)
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
  sourceLocale = "fr"
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
   Cache mémoire (évite spam)
========================= */
const memCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

/* =========================
   <T> inchangé (ta version)
========================= */
export function T({ children }: { children: React.ReactNode }) {
  const raw = typeof children === "string" ? children : null;
  const { text } = useAutoTranslate(raw ?? "");

  if (raw === null) return <>{children}</>;
  return <span suppressHydrationWarning>{text}</span>;
}

/* =========================
   ✅ Hook : useTr() → tr("...")
   - Retourne une STRING immédiatement
   - Lance la traduction en background si manquante
   - Re-render automatiquement quand dispo
========================= */
export function useTr() {
  const { locale } = useLang();

  const [tick, setTick] = useState(0); // force re-render quand une traduction arrive
  const tickRef = useRef(0);

  // petite file des textes demandés pendant le render
  const pendingRef = useRef<Set<string>>(new Set());

  // normalise comme ton hook
  const normalize = useCallback((s: string) => (s ?? "").trim(), []);

  const tr = useCallback(
    (sourceText: string) => {
      const src = normalize(sourceText);

      if (!src) return "";
      if (!locale || locale === DEFAULT_LOCALE) return src;

      const key = stableKey(locale, src);

      // 1) cache mémoire
      const memHit = memCache.get(key);
      if (memHit) return memHit;

      // 2) cache localStorage
      if (typeof window !== "undefined") {
        const lsHit = window.localStorage.getItem(key);
        if (lsHit) {
          memCache.set(key, lsHit);
          return lsHit;
        }
      }

      // 3) pas trouvé => on planifie une traduction (sans bloquer le render)
      pendingRef.current.add(src);
      return src; // fallback immédiat
    },
    [locale, normalize]
  );

  useEffect(() => {
    // Rien à faire si FR
    if (!locale || locale === DEFAULT_LOCALE) return;

    const list = Array.from(pendingRef.current);
    pendingRef.current.clear();
    if (list.length === 0) return;

    let canceled = false;

    (async () => {
      for (const src of list) {
        const key = stableKey(locale, src);

        // déjà rempli entre temps ?
        if (memCache.has(key)) continue;

        // inflight partagé (évite appels multiples)
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

          // force re-render (un tick suffit)
          tickRef.current += 1;
          setTick(tickRef.current);
        } catch {
          // on ignore l'erreur ici (fallback = texte source)
        }
      }
    })();

    return () => {
      canceled = true;
    };
  }, [locale, tick]); // tick permet de “drainer” les nouveaux textes demandés

  return { tr, locale };
}
