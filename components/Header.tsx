"use client";

import Link from "next/link";
import Image from "next/image";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { T } from "@/components/T";

export function Header() {
  const pathname = usePathname();
  const onDashboard = pathname.startsWith("/dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";
  const isAbout = pathname === "/qui-sommes-nous";
  const isFaq = pathname === "/faq";

  return (
    <header className="w-full border-b border-sbc-border bg-sbc-bg/95 backdrop-blur z-30">
      <div
        className="
          mx-auto flex items-center justify-between gap-3
          px-3 sm:px-4 md:px-6 lg:px-10 xl:px-16
          py-2.5 sm:py-3
        "
      >
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex-shrink-0">
            <Image
              src="/logo-smart-business-corp.png"
              alt="Smart Business Corp Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col leading-tight truncate">
            <span className="text-sm sm:text-base md:text-lg font-semibold text-sbc-gold tracking-wide truncate">
              Smart Business Corp
            </span>
            <span className="text-[9px] sm:text-[10px] md:text-[11px] text-sbc-muted">
              <T>Plateforme d&apos;investissement</T>
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2 text-xs md:text-[11px]">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-full border transition ${
              isHome
                ? "border-sbc-gold bg-sbc-gold/10 text-sbc-gold"
                : "border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft"
            }`}
          >
            <T>Accueil</T>
          </Link>

          <Link
            href="/qui-sommes-nous"
            className={`px-3 py-1.5 rounded-full border transition ${
              isAbout
                ? "border-sbc-gold bg-sbc-gold/10 text-sbc-gold"
                : "border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft"
            }`}
          >
            <T>Qui sommes-nous</T>
          </Link>

          <Link
            href="/faq"
            className={`px-3 py-1.5 rounded-full border transition ${
              isFaq
                ? "border-sbc-gold bg-sbc-gold/10 text-sbc-gold"
                : "border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft"
            }`}
          >
            <T>FAQ</T>
          </Link>

          <Link
            href={onDashboard ? "/dashboard" : "/login"}
            className={`px-3 py-1.5 rounded-full border text-xs md:text-sm transition ${
              onDashboard
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                : "border-sbc-gold bg-sbc-gold text-sbc-bg hover:bg-sbc-goldSoft hover:text-sbc-bg"
            }`}
          >
            <T>{onDashboard ? "Dashboard" : "Espace client"}</T>
          </Link>

          {/* 🌍 switcher */}
          <LanguageSwitcher />
        </nav>

        <button
          type="button"
          className="
            md:hidden inline-flex items-center justify-center rounded-full
            border border-sbc-border px-2.5 py-1.5 text-xs text-sbc-muted
            hover:border-sbc-gold hover:text-sbc-gold
          "
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Ouvrir le menu"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-[3px]">
            <span className={`h-0.5 w-4 rounded-full bg-sbc-muted transition ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
            <span className={`h-0.5 w-4 rounded-full bg-sbc-muted transition ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-4 rounded-full bg-sbc-muted transition ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
          </div>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-sbc-border bg-sbc-bg/98 px-3 sm:px-4 pb-3">
          <nav className="flex flex-col gap-2 pt-2 text-xs">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`w-full px-3 py-2 rounded-full border transition ${
                isHome
                  ? "border-sbc-gold bg-sbc-gold/10 text-sbc-gold"
                  : "border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft"
              }`}
            >
              <T>Accueil</T>
            </Link>

            <Link
              href="/qui-sommes-nous"
              onClick={() => setMobileOpen(false)}
              className={`w-full px-3 py-2 rounded-full border transition ${
                isAbout
                  ? "border-sbc-gold bg-sbc-gold/10 text-sbc-gold"
                  : "border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft"
              }`}
            >
              <T>Qui sommes-nous</T>
            </Link>

            <Link
              href="/faq"
              onClick={() => setMobileOpen(false)}
              className={`w-full px-3 py-2 rounded-full border transition ${
                isFaq
                  ? "border-sbc-gold bg-sbc-gold/10 text-sbc-gold"
                  : "border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft"
              }`}
            >
              <T>FAQ</T>
            </Link>

            <Link
              href={onDashboard ? "/dashboard" : "/login"}
              onClick={() => setMobileOpen(false)}
              className={`
                w-full px-3 py-2 rounded-full border text-xs font-medium mt-1 transition
                ${
                  onDashboard
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                    : "border-sbc-gold bg-sbc-gold text-sbc-bg hover:bg-sbc-goldSoft hover:text-sbc-bg"
                }
              `}
            >
              <T>{onDashboard ? "Dashboard" : "Espace client"}</T>
            </Link>

            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
