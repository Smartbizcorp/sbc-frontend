// frontend/app/(client)/layout.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  href: string;
  label: string;
  group?: "main" | "secondary";
};

const items: Item[] = [
  // Liens principaux
  { href: "/dashboard", label: "Dashboard", group: "main" },
  { href: "/compte", label: "Compte", group: "main" },
  { href: "/notifications", label: "Notifications", group: "main" },

  // Liens secondaires
  {
    href: "/politique-confidentialite",
    label: "Politique de confidentialité",
    group: "secondary",
  },
  { href: "/assistance", label: "Assistance", group: "secondary" },
];

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname.startsWith("/dashboard");
    }
    return pathname === href;
  };

  const mainItems = items.filter((i) => i.group !== "secondary");
  const secondaryItems = items.filter((i) => i.group === "secondary");

  return (
    <div className="min-h-screen w-full bg-sbc-bg text-sbc-text overflow-x-hidden">
      {/* GRID GLOBALE : SIDEBAR + CONTENU */}
      <div className="grid min-h-screen grid-cols-[260px,1fr]">
        {/* SIDEBAR COLLÉE À GAUCHE */}
        <aside className="border-r border-sbc-border/60 bg-sbc-bgSoft/60 px-3 md:px-4 py-6 flex flex-col">
          <div className="mb-6 px-1">
            <p className="text-[10px] uppercase tracking-[0.26em] text-sbc-gold/70">
              Espace client
            </p>
            <p className="text-sm font-semibold mt-1">Smart Business Corp</p>
          </div>

          {/* NAVIGATION : liens principaux + liens secondaires en bas */}
          <nav className="flex flex-col justify-between gap-6 h-full">
            {/* Liens principaux */}
            <div className="flex flex-col gap-2 text-xs md:text-sm">
              {mainItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`w-full rounded-full px-4 py-2 border transition flex items-center justify-between ${
                      active
                        ? "border-sbc-gold bg-sbc-gold text-sbc-bgSoft shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                        : "border-sbc-border bg-sbc-bgSoft/40 text-sbc-text hover:bg-sbc-bgSoft/80 hover:border-sbc-gold/60"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-sbc-bgSoft" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Liens secondaires en bas du menu */}
            <div className="flex flex-col gap-1 pt-3 border-t border-sbc-border/40 text-[11px] md:text-xs">
              {secondaryItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`w-full rounded-full px-3 py-1.5 border transition ${
                      active
                        ? "border-sbc-gold/90 bg-sbc-gold/10 text-sbc-gold"
                        : "border-transparent text-sbc-muted hover:border-sbc-border/60 hover:bg-sbc-bgSoft/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className="py-6 md:py-10 px-4 md:px-8">
          {/* 🔽 largeur légèrement réduite */}
          <div className="w-full max-w-5xl 2xl:max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
