"use client";

import { SUPPORTED_LOCALES } from "@/lib/i18n";
import { useLang } from "@/lib/i18n-provider";
import { T } from "@/components/T";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLang();

  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-[10px] sm:text-[11px] text-sbc-muted">
        <T>Langue</T>
      </span>

      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        className="
          rounded-full border border-sbc-border bg-sbc-bgSoft/60
          px-3 py-2 text-[11px] text-sbc-text
          focus:outline-none focus:ring-2 focus:ring-sbc-gold/40
        "
      >
        {SUPPORTED_LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
