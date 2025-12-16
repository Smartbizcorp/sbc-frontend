"use client";

export const DEFAULT_LOCALE = "fr";
export const LOCALE_STORAGE_KEY = "sbc_locale";
export const LOCALE_COOKIE_KEY = "sbc_locale";

/** Langues autorisées */
export const SUPPORTED_LOCALES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]["code"];

export function normalizeLocale(input?: string | null): SupportedLocale {
  const v = (input ?? "").trim().toLowerCase();
  const exists = SUPPORTED_LOCALES.some((l) => l.code === v);
  return (exists ? v : DEFAULT_LOCALE) as SupportedLocale;
}

export function getLocaleClient(): SupportedLocale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  // 1) query ?lang=xx
  const params = new URLSearchParams(window.location.search);
  const q = params.get("lang");
  if (q) return normalizeLocale(q);

  // 2) localStorage
  const ls = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (ls) return normalizeLocale(ls);

  // 3) cookie
  const cookie = document.cookie
    .split(";")
    .map((s) => s.trim())
    .find((c) => c.startsWith(`${LOCALE_COOKIE_KEY}=`));

  if (cookie) {
    const val = decodeURIComponent(cookie.split("=").slice(1).join("="));
    return normalizeLocale(val);
  }

  return DEFAULT_LOCALE;
}

export function setLocaleClient(locale: SupportedLocale) {
  if (typeof window === "undefined") return;
  const normalized = normalizeLocale(locale);

  window.localStorage.setItem(LOCALE_STORAGE_KEY, normalized);

  const maxAge = 60 * 60 * 24 * 365; // 1 an
  document.cookie = `${LOCALE_COOKIE_KEY}=${encodeURIComponent(
    normalized
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}
