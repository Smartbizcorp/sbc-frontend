"use client";

import { useCallback, useEffect, useState } from "react";

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | "unknown">(
    "unknown"
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!("serviceWorker" in navigator) || !("Notification" in window)) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    setPermission(Notification.permission);

    // On enregistre le SW mais on ne fait rien de bloquant
    navigator.serviceWorker
      .register("/sw.js")
      .catch((err) => console.error("SW registration error", err));
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported || typeof window === "undefined") return;

    // Dans l’app installée, on évite de redemander si déjà "granted"
    if (isStandaloneMode() && Notification.permission === "granted") {
      return;
    }

    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm !== "granted") return;

    const reg = await navigator.serviceWorker.ready;

    // Récupérer la clé publique
    const resp = await fetch("/api/push/public-key");
    const { publicKey } = await resp.json();

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
  }, [isSupported]);

  return { isSupported, permission, subscribe };
}

function urlBase64ToUint8Array(base64String: string) {
  const pad = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + pad).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
