"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function MobileSplash() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 768px)").matches) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 2200);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sbc-bg">
      <div className="relative flex flex-col items-center gap-3 px-10 py-6 rounded-3xl bg-sbc-bgSoft/90 border border-sbc-gold/60 shadow-[0_0_40px_rgba(0,0,0,0.75)]">
        <div className="relative h-16 w-16">
          <Image
            src="/logo-smart-business-corp.png"
            alt="Smart Business Corp"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-sbc-gold tracking-wide">
            Smart Business Corp
          </p>
          <p className="text-[11px] text-sbc-muted mt-1">
            Chargement de votre espace d&apos;investissement...
          </p>
        </div>
      </div>
    </div>
  );
}
