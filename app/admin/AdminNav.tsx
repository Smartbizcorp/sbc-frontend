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
    <nav className="flex flex-col gap-3 mb-6">
      {/* Titre admin */}
      <h2 className="text-lg md:text-xl font-semibold text-sbc-gold">
        Zone administration
      </h2>

      {/* Liens */}
      <div className="flex flex-wrap gap-2">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                px-4 py-2 rounded-full text-xs md:text-sm border transition
                ${
                  active
                    ? "border-sbc-gold bg-sbc-gold text-sbc-bg font-semibold"
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
