"use client";

import { useEffect, useState } from "react";

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export function PwaInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ⚠️ Si on est déjà dans l'app installée, on ne montre **rien**
    if (isStandaloneMode()) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setCanInstall(false);
      setDeferredPrompt(null);
    }
  };

  if (!canInstall) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="max-w-sm w-full bg-slate-900/90 border border-yellow-400/40 rounded-2xl px-4 py-3 shadow-lg backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-xs text-sbc-muted">
              💡 Astuce
            </p>
            <p className="text-sm font-semibold text-sbc-text">
              Installe Smart Business Corp sur ton écran d’accueil.
            </p>
          </div>
          <button
            onClick={handleInstall}
            className="text-xs px-3 py-1.5 rounded-full bg-yellow-400 text-black font-semibold"
          >
            Installer
          </button>
        </div>
      </div>
    </div>
  );
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};
