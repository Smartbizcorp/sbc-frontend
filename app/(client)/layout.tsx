// frontend/app/(client)/layout.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotificationsBadge } from "../hooks/useNotificationsBadge";

type Item = {
  href: string;
  label: string;
  group?: "main" | "secondary";
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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

  const { unreadCount, refreshUnread, setUnreadCount } =
    useNotificationsBadge();

  const isNotificationsPage = pathname?.startsWith("/notifications");

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname.startsWith("/dashboard");
    }
    if (href === "/notifications") {
      return isNotificationsPage;
    }
    return pathname === href;
  };

  const mainItems = items.filter((i) => i.group !== "secondary");
  const secondaryItems = items.filter((i) => i.group === "secondary");

  async function handleNotificationsClick() {
    try {
      await fetch(`${API_URL}/api/notifications/mark-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ all: true }),
      });
      // on vide le compteur local
      setUnreadCount(0);
    } catch {
      // silencieux
    } finally {
      // on resynchronise au cas où
      refreshUnread();
    }
  }

  return (
    <div className="min-h-screen w-full bg-sbc-bg text-sbc-text overflow-x-hidden">
      {/* 📱 MOBILE : flex-col / 💻 DESKTOP : grid avec sidebar */}
      <div className="min-h-screen flex flex-col md:grid md:grid-cols-[260px,1fr]">
        {/* SIDEBAR / TOPBAR */}
        <aside
          className="
            flex flex-col
            border-b border-sbc-border/60
            bg-sbc-bgSoft/80
            px-3 md:px-4 py-4 md:py-6
            md:border-b-0 md:border-r
            md:bg-sbc-bgSoft/60
            sticky top-0 z-30 md:static
            backdrop-blur-md
          "
        >
          {/* Header : titre + pastille SBC sur mobile */}
          <div className="mb-4 md:mb-6 px-1 flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] md:text-[10px] uppercase tracking-[0.26em] text-sbc-gold/70">
                Espace client
              </p>
              <p className="text-sm font-semibold mt-1">Smart Business Corp</p>
            </div>

            {/* Petit logo rond pour mobile */}
            <div className="md:hidden flex items-center justify-center h-8 w-8 rounded-full border border-sbc-gold/70 text-[11px] font-semibold text-sbc-gold">
              SBC
            </div>
          </div>

          {/* NAVIGATION : liens principaux + secondaires */}
          <nav className="flex flex-col justify-between gap-4 h-full">
            {/* Liens principaux */}
            <div className="flex flex-col gap-1.5 md:gap-2 text-xs md:text-sm">
              {mainItems.map((item) => {
                const active = isActive(item.href);
                const isNotifLink = item.href === "/notifications";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={isNotifLink ? handleNotificationsClick : undefined}
                    className={`
                      w-full rounded-full px-3.5 md:px-4 py-1.5 md:py-2 border transition
                      flex items-center justify-between
                      ${
                        active
                          ? "border-sbc-gold bg-sbc-gold text-sbc-bgSoft shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                          : "border-sbc-border bg-sbc-bgSoft/40 text-sbc-text hover:bg-sbc-bgSoft/80 hover:border-sbc-gold/60"
                      }
                    `}
                  >
                    <span className="truncate">{item.label}</span>

                    <div className="flex items-center gap-1">
                      {/* Voyant rouge notifications */}
                      {isNotifLink && unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold w-4 h-4">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}

                      {/* Point pour le lien actif */}
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-sbc-bgSoft" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Liens secondaires */}
            <div className="flex flex-col gap-1 pt-2 md:pt-3 border-t border-sbc-border/40 text-[10px] md:text-[11px]">
              {secondaryItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      w-full rounded-full px-3 py-1.5 border transition
                      ${
                        active
                          ? "border-sbc-gold/90 bg-sbc-gold/10 text-sbc-gold"
                          : "border-transparent text-sbc-muted hover:border-sbc-border/60 hover:bg-sbc-bgSoft/60"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className="py-4 md:py-8 px-3 md:px-8">
          <div className="w-full max-w-full md:max-w-5xl 2xl:max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
