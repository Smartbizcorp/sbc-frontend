"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/withdrawals", label: "Withdrawals" },
  { href: "/admin/investments", label: "Investments" },
  { href: "/admin/support", label: "Support" }, // 👈 nouveau bouton
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-6">
      {/* Titre admin */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-sbc-gold">
          Zone administration
        </h2>

        {/* Petit badge “Admin” visible surtout sur mobile */}
        <span className="inline-flex md:hidden text-[10px] px-2 py-0.5 rounded-full border border-sbc-gold/60 text-sbc-gold/90">
          Admin
        </span>
      </div>

      {/* Liens */}
      <div
        className="
          flex flex-nowrap md:flex-wrap gap-2
          overflow-x-auto md:overflow-visible
          pb-1 md:pb-0
          -mx-1 px-1 md:mx-0 md:px-0
        "
      >
        {links.map((link) => {
          const active = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                px-3 sm:px-4 py-1.5 sm:py-2 rounded-full
                text-[11px] sm:text-xs md:text-sm
                border transition whitespace-nowrap
                ${
                  active
                    ? "border-sbc-gold bg-sbc-gold text-sbc-bg font-semibold shadow-[0_0_15px_rgba(212,175,55,0.35)]"
                    : "border-sbc-border text-sbc-muted hover:border-sbc-gold hover:text-sbc-gold"
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
