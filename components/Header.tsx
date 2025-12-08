
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const onDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="w-full border-b border-sbc-border bg-sbc-bg/95 backdrop-blur">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 md:h-16 md:w-16">
            <Image
              src="/logo-smart-business-corp.png"
              alt="Smart Business Corp Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm md:text-lg font-semibold text-sbc-gold tracking-wide">
              Smart Business Corp
            </span>
            <span className="text-[10px] md:text-[11px] text-sbc-muted">
              Plateforme d&apos;investissement
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 text-xs md:text-[11px]">
          <Link href="/" className={`px-3 py-1.5 rounded-full border ${pathname === "/" ? "border-sbc-gold bg-sbc-gold/10 text-sbc-gold" : "border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft"}`}>
            Accueil
          </Link>

          <Link href="/qui-sommes-nous" className={`px-3 py-1.5 rounded-full border ${pathname === "/qui-sommes-nous" ? "border-sbc-gold bg-sbc-gold/10 text-sbc-gold" : "border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft"}`}>
            Qui sommes-nous
          </Link>

          <Link
  href="/faq"
  className="px-4 py-2 rounded-full text-xs md:text-sm text-sbc-text hover:text-sbc-gold transition"
>
  FAQ
</Link>

          <Link href={onDashboard ? "/dashboard" : "/login"} className={`px-3 py-1.5 rounded-full border ${onDashboard ? "border-emerald-500 bg-emerald-500/10 text-emerald-300" : "border-sbc-gold bg-sbc-gold text-sbc-bg hover:bg-sbc-goldSoft hover:text-sbc-bg"}`}>
            {onDashboard ? "Dashboard" : "Espace client"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
