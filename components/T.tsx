"use client";

import { useAutoTranslate } from "@/lib/useAutoTranslate";
import { useLocale } from "@/lib/useLocale";

export function T({ children }: { children: string }) {
  const { locale } = useLocale();

  const { translated } = useAutoTranslate({
    text: children,
    from: "fr",
    to: locale,
    enabled: locale !== "fr",
  });

  return <>{translated}</>;
}
