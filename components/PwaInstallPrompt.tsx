"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

const STORAGE_KEY = "sbc_pwa_prompt_dismissed";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // si l'utilisateur a déjà dit "plus tard", on ne réaffiche pas
    if (localStorage.getItem(STORAGE_KEY) === "1") return;

    const handler = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler as any);
    return () =>
      window.removeEventListener("beforeinstallprompt", handler as any);
  }, []);

  if (!visible || !deferredPrompt) return null;

  const handleInstall = async () => {
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      // si l'utilisateur refuse, on ne réaffichera plus
      if (choice.outcome === "dismissed") {
        localStorage.setItem(STORAGE_KEY, "1");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVisible(false);
      setDeferredPrompt(null);
    }
  };

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center px-3 sm:px-0 md:hidden">
      <div className="w-full max-w-sm rounded-2xl border border-sbc-border bg-sbc-bgSoft/95 shadow-[0_18px_60px_rgba(0,0,0,0.95)] px-3 py-3 flex items-start gap-3">
        <div className="mt-0.5 h-8 w-8 rounded-2xl overflow-hidden bg-sbc-bg border border-sbc-border flex items-center justify-center text-xs">
          <span className="text-sbc-gold font-semibold">SBC</span>
        </div>
        <div className="flex-1 text-[11px] sm:text-xs">
          <p className="font-semibold text-sbc-text mb-0.5">
            Installer Smart Business Corp
          </p>
          <p className="text-sbc-muted">
            Ajoutez l&apos;application sur votre écran d&apos;accueil pour un
            accès plus rapide.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handleInstall}
              className="px-3 py-1.5 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bgSoft text-[11px] font-semibold hover:bg-sbc-goldSoft transition"
            >
              Installer
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 rounded-full border border-sbc-border text-[11px] text-sbc-muted hover:bg-sbc-bgSoft transition"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
