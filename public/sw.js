// Version simple et safe du service worker

self.addEventListener("install", (event) => {
  // On active tout de suite la nouvelle version
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // On prend le contrôle des clients ouverts
  event.waitUntil(self.clients.claim());
});

// ⚠️ Pas de fetch handler → on ne modifie pas le réseau

// Réception d'une push notification
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {};
  }

  const title = data.title || "Smart Business Corp";
  const body = data.body || "Nouvelle notification.";
  const url = data.url || "https://smartbusinesscorp.org/notifications";

  const options = {
    body,
    icon: "/favicon-192.png",
    badge: "/favicon-192.png",
    data: { url },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "https://smartbusinesscorp.org";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
      for (const client of cs) {
        if ("focus" in client && client.url === url) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
