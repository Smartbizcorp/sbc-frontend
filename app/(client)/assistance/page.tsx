"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { T } from "@/components/T";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type Sender = "user" | "bot" | "admin" | "system";

type ChatMessage = {
  id: string | number;
  sender: Sender;
  text: string;
  createdAt: string;
};

type ApiReply = {
  ok: boolean;
  success?: boolean;
  type: "bot" | "admin_pending" | "admin_only";
  message: string;
  conversationId?: number;
};

// ce que renvoie GET /api/support/conversations/:id/messages
type BackendMessage = {
  id: number;
  sender: "USER" | "ADMIN" | "BOT";
  text: string;
  createdAt: string;
};

async function safeJson(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Réponse NON JSON :", res.url, text);
    throw new Error("Le serveur a répondu avec un format invalide.");
  }
  return res.json();
}

export default function AssistancePage() {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const pollingLockRef = useRef(false);

  const forceLogout = () => {
    try {
      localStorage.removeItem("sbc_user");
    } catch {}
    router.push("/login");
  };

  // Scroll auto vers le bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // 🔁 mapper les messages backend → frontend
  const mapBackendMessages = (backend: BackendMessage[]): ChatMessage[] => {
    return (backend || []).map((m) => {
      let sender: Sender = "system";
      if (m.sender === "USER") sender = "user";
      else if (m.sender === "ADMIN") sender = "admin";
      else if (m.sender === "BOT") sender = "bot";

      return {
        id: m.id,
        sender,
        text: m.text,
        createdAt: m.createdAt,
      };
    });
  };

  // 🔁 charge les messages d’une conversation
  const fetchMessages = async (convId: number, signal?: AbortSignal) => {
    const res = await fetch(
      `${API_URL}/api/support/conversations/${convId}/messages`,
      { credentials: "include", signal }
    );

    if (res.status === 401) {
      forceLogout();
      return;
    }

    const data = await safeJson(res);

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Erreur lors du chargement des messages.");
    }

    const mapped = mapBackendMessages(data.messages || []);
    setMessages(mapped);
  };

  // 1️⃣ Au chargement, récupérer la dernière conversation du client
  useEffect(() => {
    let mounted = true;
    const ac = new AbortController();

    const loadInitial = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        const rawUser = localStorage.getItem("sbc_user");
        if (!rawUser) {
          forceLogout();
          return;
        }

        const res = await fetch(`${API_URL}/api/support/conversations`, {
          credentials: "include",
          signal: ac.signal,
        });

        if (res.status === 401) {
          forceLogout();
          return;
        }

        const data = await safeJson(res);

        if (!res.ok || !data.success) {
          throw new Error(
            data.message || "Erreur lors du chargement de l'assistance."
          );
        }

        const convs = data.conversations || [];
        if (convs.length > 0) {
          const conv = convs[0]; // dernière conversation
          if (!mounted) return;
          setConversationId(conv.id);
          await fetchMessages(conv.id, ac.signal);
        } else {
          if (!mounted) return;
          setMessages([]);
        }
      } catch (e: any) {
        if (!mounted) return;
        if (e?.name === "AbortError") return;
        console.error(e);
        setError(e?.message || "Erreur lors du chargement de l'assistance.");
      } finally {
        if (!mounted) return;
        setInitialLoading(false);
      }
    };

    loadInitial();

    return () => {
      mounted = false;
      ac.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2️⃣ Polling toutes les 5s
  useEffect(() => {
    if (!conversationId) return;

    let mounted = true;
    const ac = new AbortController();

    const tick = async () => {
      if (!mounted) return;
      if (pollingLockRef.current) return;
      pollingLockRef.current = true;
      try {
        await fetchMessages(conversationId, ac.signal);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        console.error("Polling support error:", e);
        // on évite de spam l'UI avec une erreur de polling
      } finally {
        pollingLockRef.current = false;
      }
    };

    // première récupération immédiate
    tick();

    const intervalId = setInterval(tick, 5000);

    return () => {
      mounted = false;
      ac.abort();
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const text = input.trim();
    setInput("");
    setError(null);

    // ✅ Optimistic UI : on push le message utilisateur tout de suite
    const nowIso = new Date().toISOString();
    const optimisticId = `local-${nowIso}`;
    setMessages((prev) => [
      ...prev,
      { id: optimisticId, sender: "user", text, createdAt: nowIso },
    ]);

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/support/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          message: text,
          conversationId: conversationId ?? undefined,
          history: [
            ...messages.map((m) => ({ sender: m.sender, text: m.text })),
            { sender: "user", text },
          ],
        }),
      });

      if (res.status === 401) {
        forceLogout();
        return;
      }

      const data: ApiReply = await safeJson(res);

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Erreur survenue lors de l’envoi.");
      }

      const convId = data.conversationId ?? conversationId;

      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      // on recharge depuis le backend pour être 100% sync
      if (convId) {
        await fetchMessages(convId);
      } else {
        // fallback très rare
        if (data.type === "bot") {
          setMessages((prev) => [
            ...prev,
            { id: `bot-${nowIso}`, sender: "bot", text: data.message, createdAt: nowIso },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: `system-${nowIso}`,
              sender: "system",
              text: data.message || "Votre demande a été transmise à un administrateur.",
              createdAt: nowIso,
            },
          ]);
        }
      }
    } catch (e: any) {
      console.error(e);

      // si échec, on informe + (optionnel) marquer le dernier message local
      setError(e?.message || "Impossible d’envoyer le message pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <main className="w-full min-h-[calc(100vh-120px)] px-4 sm:px-6 py-6 sm:py-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 md:gap-8 h-full">
        {/* HEADER */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          <div className="flex-1">
            <p className="text-[11px] uppercase tracking-[0.26em] text-sbc-gold">
              <T>Assistance</T>
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">
              <T>Centre d&apos;aide Smart Business Corp</T>
            </h1>
            <p className="text-xs md:text-sm text-sbc-muted max-w-xl mt-2 leading-relaxed">
              <T>Posez vos questions sur vos investissements, retraits ou fonctionnement de la plateforme.</T>{" "}
              <T>Le</T>{" "}
              <span className="text-sbc-gold font-semibold">
                <T>bot</T>
              </span>{" "}
              <T>répond aux demandes courantes, et un</T>{" "}
              <span className="text-sbc-gold font-semibold">
                <T>administrateur humain</T>
              </span>{" "}
              <T>prend le relais pour les cas spécifiques.</T>
            </p>
          </div>

          <div className="w-full md:w-auto rounded-2xl border border-sbc-border/60 bg-sbc-bgSoft/70 px-4 py-3 text-[11px] md:text-xs text-sbc-muted">
            <p className="font-semibold text-sbc-gold mb-1">
              <T>Comment ça fonctionne ?</T>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><T>Le bot répond immédiatement aux questions fréquentes.</T></li>
              <li><T>En cas de besoin, un ticket est créé et un admin vous répondra.</T></li>
              <li>
                <T>Les messages marqués</T>{" "}
                <span className="text-sbc-gold"><T>Admin</T></span>{" "}
                <T>viennent d&apos;un membre de l&apos;équipe.</T>
              </li>
            </ul>
          </div>
        </section>

        {/* BLOC CHAT */}
        <section className="flex-1 flex flex-col bg-sbc-bgSoft/70 border border-sbc-border rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden min-h-[340px]">
          {/* En-tête du chat */}
          <div className="px-4 md:px-6 py-3 border-b border-sbc-border/60 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs md:text-sm font-medium text-sbc-text">
                <T>Chat assistance</T>
              </p>
            </div>
            <p className="text-[10px] md:text-[11px] text-sbc-muted">
              <T>Temps de réponse : immédiat (bot) · quelques minutes (admin)</T>
            </p>
          </div>

          {/* Zone messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3 text-xs md:text-sm">
            {initialLoading && (
              <div className="text-[11px] text-sbc-muted">
                <T>Chargement…</T>
              </div>
            )}

            {!initialLoading && messages.length === 0 && (
              <div className="text-[11px] md:text-xs text-sbc-muted/80 italic">
                <T>
                  Commencez la discussion en posant votre première question (ex.
                  « Comment demander un retrait ? »).
                </T>
              </div>
            )}

            {messages.map((m) => {
              const isUser = m.sender === "user";
              const isBot = m.sender === "bot";
              const isAdmin = m.sender === "admin";
              const isSystem = m.sender === "system";

              const align = isUser ? "items-end" : "items-start";

              let bubbleClasses =
                "max-w-[80%] rounded-2xl px-3 py-2 shadow-sm border text-[11px] md:text-xs leading-relaxed";

              if (isUser) {
                bubbleClasses += " bg-sbc-gold text-sbc-bgSoft border-sbc-gold/80";
              } else if (isAdmin) {
                bubbleClasses += " bg-sbc-bg border-sbc-gold/70 text-sbc-text";
              } else if (isBot) {
                bubbleClasses += " bg-sbc-bgSoft border-sbc-border/70 text-sbc-text";
              } else {
                bubbleClasses +=
                  " bg-sbc-bgSoft/40 border-dashed border-sbc-border/60 text-sbc-muted";
              }

              return (
                <div key={m.id} className={`flex ${align}`}>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-sbc-muted">
                        {isUser && <T>Vous</T>}
                        {isBot && <T>Bot</T>}
                        {isAdmin && (
                          <span className="px-2 py-0.5 rounded-full bg-sbc-gold/10 text-sbc-gold border border-sbc-gold/60 text-[9px] uppercase tracking-[0.16em]">
                            <T>Admin</T>
                          </span>
                        )}
                        {isSystem && <T>Système</T>}
                      </span>
                      <span className="text-[9px] text-sbc-muted/60">
                        {formatTime(m.createdAt)}
                      </span>
                    </div>

                    <div className={bubbleClasses}>
                      <T>{m.text}</T>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>

          {/* Zone saisie */}
          <div className="border-t border-sbc-border/60 px-4 md:px-6 py-3 bg-sbc-bgSoft/80">
            {error && (
              <p className="mb-2 text-[11px] text-red-300">
                <T>{error}</T>
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Écrivez votre message ici…"
                className="flex-1 resize-none rounded-2xl border border-sbc-border/70 bg-sbc-bg/80 px-3 py-2 text-xs md:text-sm text-sbc-text placeholder:text-sbc-muted focus:outline-none focus:ring-1 focus:ring-sbc-gold focus:border-sbc-gold"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="inline-flex whitespace-nowrap items-center justify-center rounded-2xl px-4 py-2 text-xs md:text-sm font-semibold border border-sbc-gold bg-sbc-gold text-sbc-bgSoft disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sbc-goldSoft hover:text-sbc-bg transition"
              >
                {loading ? <T>Envoi…</T> : <T>Envoyer</T>}
              </button>
            </div>
            <p className="mt-1 text-[10px] text-sbc-muted">
              <T>Appuyez sur</T> <span className="font-semibold"><T>Entrée</T></span>{" "}
              <T>pour envoyer,</T>{" "}
              <span className="font-semibold"><T>Maj + Entrée</T></span>{" "}
              <T>pour aller à la ligne.</T>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
