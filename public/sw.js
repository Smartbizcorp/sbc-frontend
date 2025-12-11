/* self.__WB_DISABLE_DEV_LOGS = true; */

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: "Notification", body: event.data.text() };
  }

  const title = data.title || "Smart Business Corp";
  const body = data.body || "";
  const url = data.url || "https://smartbusinesscorp.org";

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
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((cl) => {
      const client = cl.find((c) => c.url === url);
      if (client) return client.focus();
      return clients.openWindow(url);
    })
  );
});
