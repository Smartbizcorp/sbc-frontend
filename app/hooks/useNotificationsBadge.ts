"use client";

import { useEffect, useState, useCallback } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type UnreadResponse = {
  success: boolean;
  unreadCount: number;
};

export function useNotificationsBadge() {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications/unread-count`, {
        credentials: "include",
      });
      if (!res.ok) return;
      const data: UnreadResponse = await res.json();
      if (data.success) {
        setUnreadCount(data.unreadCount ?? 0);
      }
    } catch {
      // silencieux
    }
  }, []);

  useEffect(() => {
    fetchUnread();
    const id = setInterval(fetchUnread, 30_000); // refresh toutes les 30s
    return () => clearInterval(id);
  }, [fetchUnread]);

  return {
    unreadCount,
    refreshUnread: fetchUnread,
    setUnreadCount,
  };
}
