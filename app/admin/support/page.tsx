"use client";

import { useEffect, useState } from "react";
import AdminNav from "../AdminNav";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type AdminUser = {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
};

type ConversationListItem = {
  id: number;
  user: AdminUser;
  status: string; // "OPEN" | "NEEDS_ADMIN" | "CLOSED"
  lastMessage: string | null;
  lastMessageAt: string;
};

type SupportMessage = {
  id: number;
  conversationId: number;
  sender: string; // "USER" | "ADMIN" | "BOT"
  text: string;
  createdAt: string;
  seenByAdmin: boolean;
  seenByUser: boolean;
};

type ConversationDetail = {
  id: number;
  status: string;
  user: AdminUser;
};

export default function AdminSupportPage() {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [errorConversations, setErrorConversations] = useState<string | null>(
    null
  );

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [conversation, setConversation] = useState<ConversationDetail | null>(
    null
  );
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string | null>(null);

  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  // Chargement liste des conversations
  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      setErrorConversations(null);

      const res = await fetch(`${API_BASE}/api/admin/support/conversations`, {
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        setErrorConversations(
          "Accès non autorisé. Connectez-vous en tant qu'administrateur."
        );
        setConversations([]);
        return;
      }

      if (!res.ok) {
        throw new Error(
          `Erreur serveur (${res.status}) lors du chargement des conversations.`
        );
      }

      const data = await res.json();
      setConversations(data.conversations ?? []);
    } catch (err: any) {
      console.error(err);
      setErrorConversations(
        err?.message || "Impossible de charger les conversations."
      );
    } finally {
      setLoadingConversations(false);
    }
  };

  // Chargement d'une conversation + messages
  const loadConversationMessages = async (id: number) => {
    try {
      setLoadingMessages(true);
      setErrorMessages(null);

      const res = await fetch(
        `${API_BASE}/api/admin/support/conversations/${id}/messages`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          setErrorMessages("Conversation introuvable.");
        } else {
          setErrorMessages(
            `Erreur serveur (${res.status}) lors du chargement des messages.`
          );
        }
        setConversation(null);
        setMessages([]);
        return;
      }

      const data = await res.json();
      setConversation(data.conversation);
      setMessages(data.messages ?? []);
    } catch (err: any) {
      console.error(err);
      setErrorMessages(
        err?.message || "Impossible de charger les messages de la conversation."
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  // Envoi d’une réponse admin
  const handleSendReply = async () => {
    if (!selectedId || !replyText.trim()) return;

    try {
      setSendingReply(true);
      setReplyError(null);

      const res = await fetch(
        `${API_BASE}/api/admin/support/conversations/${selectedId}/reply`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: replyText.trim() }),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg =
          body?.message ||
          `Erreur lors de l'envoi de la réponse (code ${res.status}).`;
        setReplyError(msg);
        return;
      }

      setReplyText("");
      // On recharge les messages pour voir la réponse
      await loadConversationMessages(selectedId);
      // On peut aussi recharger la liste (pour mise à jour status)
      await loadConversations();
    } catch (err: any) {
      console.error(err);
      setReplyError(
        err?.message || "Impossible d'envoyer la réponse pour le moment."
      );
    } finally {
      setSendingReply(false);
    }
  };

  // On charge la liste au montage
  useEffect(() => {
    loadConversations();
  }, []);

  // Quand une conversation est sélectionnée, on charge ses messages
  useEffect(() => {
    if (selectedId != null) {
      loadConversationMessages(selectedId);
    } else {
      setConversation(null);
      setMessages([]);
    }
  }, [selectedId]);

  const formatDate = (value: string) =>
    new Date(value).toLocaleString("fr-FR");

  const renderStatusBadge = (status: string) => {
    let classes =
      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium text-white";
    if (status === "OPEN") classes += " bg-emerald-600";
    else if (status === "NEEDS_ADMIN") classes += " bg-amber-600";
    else if (status === "CLOSED") classes += " bg-slate-600";
    else classes += " bg-sbc-border";

    return <span className={classes}>{status}</span>;
  };

  const renderSenderLabel = (sender: string) => {
    if (sender === "USER") return "Client";
    if (sender === "ADMIN") return "Admin";
    if (sender === "BOT") return "Bot";
    return sender;
  };

  return (
    <main className="w-full min-h-screen px-4 sm:px-6 py-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 md:gap-8">
        {/* NAV ADMIN COMMUN */}
        <AdminNav />

        {/* CARTE SUPPORT */}
        <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-7 shadow-[0_22px_60px_rgba(0,0,0,0.9)] backdrop-blur-lg flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sbc-gold">
                Administration · Support
              </p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-1">
                Gestion des conversations clients
              </h1>
              <p className="text-xs sm:text-sm text-sbc-muted max-w-2xl leading-relaxed mt-1">
                Visualisez les échanges avec les clients, répondez à leurs
                questions et suivez l&apos;état de chaque conversation (ouverte, en
                attente d&apos;admin, clôturée).
              </p>
            </div>
            <button
              onClick={loadConversations}
              className="mt-2 sm:mt-0 inline-flex items-center justify-center px-3 py-1.5 rounded-full border border-sbc-border text-[11px] sm:text-xs text-sbc-muted hover:bg-sbc-bgSoft/80 transition"
            >
              Actualiser les conversations
            </button>
          </div>

          {/* Layout 2 colonnes (stack sur mobile) */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 mt-2">
            {/* Colonne gauche : liste des conversations */}
            <div className="w-full lg:w-[36%] flex flex-col gap-3 border border-sbc-border/60 rounded-2xl bg-sbc-bgSoft/60 p-3 sm:p-4 max-h-[520px] lg:max-h-[620px]">
              <h2 className="text-xs sm:text-sm font-semibold text-sbc-gold">
                Conversations
              </h2>

              {loadingConversations && (
                <p className="text-[11px] sm:text-xs text-sbc-muted">
                  Chargement des conversations…
                </p>
              )}

              {errorConversations && (
                <p className="text-[11px] sm:text-xs text-red-400">
                  {errorConversations}
                </p>
              )}

              {!loadingConversations &&
                !errorConversations &&
                conversations.length === 0 && (
                  <p className="text-[11px] sm:text-xs text-sbc-muted">
                    Aucune conversation pour le moment.
                  </p>
                )}

              <div className="flex-1 overflow-y-auto space-y-2">
                {conversations.map((c) => {
                  const isSelected = selectedId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className={`w-full text-left rounded-2xl border px-3 py-2 text-xs sm:text-sm transition ${
                        isSelected
                          ? "border-sbc-gold bg-sbc-bgSoft"
                          : "border-sbc-border bg-sbc-bgSoft/30 hover:bg-sbc-bgSoft/60"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-sbc-text truncate">
                          {c.user.fullName}
                        </p>
                        {renderStatusBadge(c.status)}
                      </div>
                      <p className="text-[11px] text-sbc-muted truncate">
                        {c.user.phone}
                        {c.user.email ? ` · ${c.user.email}` : ""}
                      </p>
                      {c.lastMessage && (
                        <p className="mt-1 text-[11px] text-sbc-muted line-clamp-2">
                          {c.lastMessage}
                        </p>
                      )}
                      {c.lastMessageAt && (
                        <p className="mt-1 text-[10px] text-sbc-muted/70">
                          Dernier message : {formatDate(c.lastMessageAt)}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colonne droite : détails + messages */}
            <div className="w-full lg:flex-1 flex flex-col border border-sbc-border/60 rounded-2xl bg-sbc-bgSoft/60 p-3 sm:p-4 max-h-[520px] lg:max-h-[620px]">
              {!selectedId && (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-[11px] sm:text-sm text-sbc-muted text-center">
                    Sélectionnez une conversation dans la colonne de gauche.
                  </p>
                </div>
              )}

              {selectedId && (
                <>
                  {/* Header conversation */}
                  <div className="pb-2 mb-3 border-b border-sbc-border/60">
                    {conversation ? (
                      <>
                        <h2 className="text-sm sm:text-base font-semibold text-sbc-text">
                          Conversation #{conversation.id}
                        </h2>
                        <p className="text-[11px] sm:text-xs text-sbc-muted mt-1">
                          <span className="font-semibold text-sbc-text">
                            {conversation.user.fullName}
                          </span>{" "}
                          ({conversation.user.phone}
                          {conversation.user.email
                            ? ` · ${conversation.user.email}`
                            : ""}
                          ){" "}
                          &nbsp; {renderStatusBadge(conversation.status)}
                        </p>
                      </>
                    ) : (
                      <h2 className="text-sm sm:text-base font-semibold text-sbc-text">
                        Conversation #{selectedId}
                      </h2>
                    )}
                  </div>

                  {/* Zone messages */}
                  <div className="flex-1 border border-sbc-border/60 rounded-2xl bg-sbc-bgSoft/70 px-3 py-2 mb-3 overflow-y-auto space-y-3">
                    {loadingMessages && (
                      <p className="text-[11px] sm:text-xs text-sbc-muted">
                        Chargement des messages…
                      </p>
                    )}

                    {errorMessages && (
                      <p className="text-[11px] sm:text-xs text-red-400">
                        {errorMessages}
                      </p>
                    )}

                    {!loadingMessages &&
                      !errorMessages &&
                      messages.length === 0 && (
                        <p className="text-[11px] sm:text-xs text-sbc-muted">
                          Aucun message dans cette conversation.
                        </p>
                      )}

                    {messages.map((m) => {
                      const isAdmin = m.sender === "ADMIN";
                      const isBot = m.sender === "BOT";

                      let bubbleClasses =
                        "inline-flex flex-col max-w-[85%] rounded-2xl px-3 py-2 text-xs sm:text-sm whitespace-pre-wrap";
                      if (isAdmin) {
                        bubbleClasses +=
                          " bg-sbc-gold text-sbc-bg shadow-[0_10px_30px_rgba(0,0,0,0.7)]";
                      } else if (isBot) {
                        bubbleClasses +=
                          " bg-amber-900/40 text-amber-50 border border-amber-500/40";
                      } else {
                        bubbleClasses +=
                          " bg-sbc-bgSoft text-sbc-text border border-sbc-border/60";
                      }

                      return (
                        <div
                          key={m.id}
                          className={`flex ${
                            isAdmin ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div className={bubbleClasses}>
                            <p className="text-[10px] mb-1 opacity-75">
                              {renderSenderLabel(m.sender)} ·{" "}
                              {new Date(m.createdAt).toLocaleString("fr-FR")}
                            </p>
                            <p>{m.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Zone de réponse */}
                  <div className="mt-auto">
                    <label
                      htmlFor="reply"
                      className="block text-xs sm:text-sm font-medium text-sbc-muted mb-1"
                    >
                      Réponse administrateur
                    </label>

                    <textarea
                      id="reply"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                      className="w-full rounded-2xl border border-sbc-border bg-sbc-bg px-3 py-2 text-xs sm:text-sm text-sbc-text outline-none focus:border-sbc-gold resize-y mb-2"
                      placeholder="Votre message…"
                    />

                    {replyError && (
                      <p className="text-[11px] sm:text-xs text-red-400 mb-2">
                        {replyError}
                      </p>
                    )}

                    <button
                      onClick={handleSendReply}
                      disabled={sendingReply || !replyText.trim()}
                      className="inline-flex items-center px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs sm:text-sm font-semibold hover:bg-sbc-goldSoft transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {sendingReply
                        ? "Envoi en cours…"
                        : "Envoyer la réponse"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
