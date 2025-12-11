"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    (async () => {
      try {
        // 1. enregistrement SW
        const reg = await navigator.serviceWorker.register("/sw.js");

        // 2. permission
        let permission = Notification.permission;
        if (permission === "default") {
          permission = await Notification.requestPermission();
        }
        if (permission !== "granted") {
          setEnabled(false);
          return;
        }

        // 3. récup clé publique
        const res = await fetch(`${API_URL}/api/push/public-key`, {
          credentials: "include",
        });
        const json = await res.json();
        const publicKey = json.publicKey as string;

        // 4. subscription
        let subscription = await reg.pushManager.getSubscription();
        if (!subscription) {
          subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          });
        }

        // 5. envoi au backend
        await fetch(`${API_URL}/api/push/subscribe`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });

        setEnabled(true);
      } catch (e) {
        console.error("Erreur push", e);
        setEnabled(false);
      }
    })();
  }, []);

  return enabled;
}
