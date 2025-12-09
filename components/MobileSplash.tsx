"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function MobileSplash() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 👉 Splash uniquement pour les écrans type mobile / petit tablet
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (!isMobile) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const timeoutId = window.setTimeout(() => {
      setVisible(false);
    }, 2200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sbc-bg">
      <div
        className="
          relative
          flex
          flex-col
          items-center
          gap-2.5
          sm:gap-3
          px-6
          sm:px-8
          md:px-10
          py-5
          sm:py-6
          rounded-3xl
          bg-sbc-bgSoft/90
          border
          border-sbc-gold/60
          shadow-[0_0_40px_rgba(0,0,0,0.75)]
          w-[80%]
          max-w-xs
          sm:max-w-sm
        "
      >
        <div className="relative h-12 w-12 sm:h-14 sm:w-14">
          <Image
            src="/logo-smart-business-corp.png"
            alt="Smart Business Corp"
            fill
            className="object-contain"
            priority
          />
        </div>

        <div className="text-center">
          <p className="text-sm sm:text-base font-semibold text-sbc-gold tracking-wide">
            Smart Business Corp
          </p>
          <p className="text-[10px] sm:text-[11px] text-sbc-muted mt-1">
            Chargement de votre espace d&apos;investissement...
          </p>
        </div>
      </div>
    </div>
  );
}
