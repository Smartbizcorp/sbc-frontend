"use client";

import React, { useEffect, useState } from "react";

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
    let color = "#555";
    if (status === "OPEN") color = "#2b8a3e";
    if (status === "NEEDS_ADMIN") color = "#e67700";
    if (status === "CLOSED") color = "#495057";

    return (
      <span
        style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: "999px",
          backgroundColor: color,
          color: "white",
          fontSize: "12px",
        }}
      >
        {status}
      </span>
    );
  };

  const renderSenderLabel = (sender: string) => {
    if (sender === "USER") return "Client";
    if (sender === "ADMIN") return "Admin";
    if (sender === "BOT") return "Bot";
    return sender;
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Colonne gauche : liste des conversations */}
      <div
        style={{
          width: "35%",
          borderRight: "1px solid #e5e5e5",
          padding: "16px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: "18px", fontWeight: 600 }}>
            Support – Conversations
          </h1>
          <button
            onClick={loadConversations}
            style={{
              padding: "4px 10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Actualiser
          </button>
        </div>

        {loadingConversations && <p>Chargement des conversations…</p>}
        {errorConversations && (
          <p style={{ color: "red" }}>{errorConversations}</p>
        )}

        {!loadingConversations && !errorConversations && conversations.length === 0 && (
          <p>Aucune conversation pour le moment.</p>
        )}

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {conversations.map((c) => (
            <li
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              style={{
                padding: "10px",
                marginBottom: "8px",
                borderRadius: "6px",
                border:
                  selectedId === c.id ? "2px solid #228be6" : "1px solid #e5e5e5",
                backgroundColor:
                  selectedId === c.id ? "#e7f5ff" : "#ffffff",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <strong>{c.user.fullName}</strong>
                {renderStatusBadge(c.status)}
              </div>
              <div style={{ fontSize: "12px", color: "#555" }}>
                {c.user.phone} {c.user.email ? `· ${c.user.email}` : ""}
              </div>
              {c.lastMessage && (
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "12px",
                    color: "#666",
                    maxHeight: "34px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {c.lastMessage}
                </div>
              )}
              {c.lastMessageAt && (
                <div
                  style={{
                    marginTop: "4px",
                    fontSize: "11px",
                    color: "#999",
                  }}
                >
                  Dernier message : {formatDate(c.lastMessageAt)}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Colonne droite : détails + messages */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!selectedId && (
          <div
            style={{
              margin: "auto",
              textAlign: "center",
              color: "#777",
            }}
          >
            <p>Sélectionnez une conversation dans la colonne de gauche.</p>
          </div>
        )}

        {selectedId && (
          <>
            {/* Header conversation */}
            <div
              style={{
                marginBottom: "12px",
                borderBottom: "1px solid #e5e5e5",
                paddingBottom: "8px",
              }}
            >
              {conversation ? (
                <>
                  <h2 style={{ fontSize: "16px", fontWeight: 600 }}>
                    Conversation #{conversation.id}
                  </h2>
                  <div style={{ fontSize: "14px", marginTop: "4px" }}>
                    <strong>{conversation.user.fullName}</strong>{" "}
                    ({conversation.user.phone}
                    {conversation.user.email
                      ? ` · ${conversation.user.email}`
                      : ""}
                    ){" "}
                    &nbsp; {renderStatusBadge(conversation.status)}
                  </div>
                </>
              ) : (
                <h2 style={{ fontSize: "16px", fontWeight: 600 }}>
                  Conversation #{selectedId}
                </h2>
              )}
            </div>

            {/* Zone messages */}
            <div
              style={{
                flex: 1,
                border: "1px solid #e5e5e5",
                borderRadius: "6px",
                padding: "8px",
                marginBottom: "12px",
                overflowY: "auto",
                backgroundColor: "#f8f9fa",
              }}
            >
              {loadingMessages && <p>Chargement des messages…</p>}
              {errorMessages && (
                <p style={{ color: "red" }}>{errorMessages}</p>
              )}
              {!loadingMessages && !errorMessages && messages.length === 0 && (
                <p>Aucun message dans cette conversation.</p>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    marginBottom: "10px",
                    textAlign: m.sender === "ADMIN" ? "right" : "left",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: "10px",
                      backgroundColor:
                        m.sender === "ADMIN"
                          ? "#228be6"
                          : m.sender === "BOT"
                          ? "#fff3bf"
                          : "#ffffff",
                      color: m.sender === "ADMIN" ? "white" : "#222",
                      maxWidth: "85%",
                      fontSize: "14px",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        marginBottom: "2px",
                        opacity: 0.75,
                      }}
                    >
                      {renderSenderLabel(m.sender)} ·{" "}
                      {new Date(m.createdAt).toLocaleString("fr-FR")}
                    </div>
                    <div>{m.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Zone de réponse */}
            <div>
              <label
                htmlFor="reply"
                style={{ display: "block", marginBottom: "4px", fontSize: "14px" }}
              >
                Réponse administrateur
</label>

<textarea
  id="reply"
  value={replyText}
  onChange={(e) => setReplyText(e.target.value)}
  rows={4}
  style={{
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #1f2937",
    fontSize: "14px",
    resize: "vertical",
    marginBottom: "8px",
    backgroundColor: "#050812",   // 👈 fond sombre
    color: "#ffffff",              // 👈 texte blanc
    outline: "none",
  }}
  placeholder="Votre message…"
/>

{replyError && (
  <p style={{ color: "red", marginBottom: "6px" }}>{replyError}</p>
)}

<button
  onClick={handleSendReply}
  disabled={sendingReply || !replyText.trim()}
  style={{
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: sendingReply ? "#adb5bd" : "#228be6",
    color: "white",
    cursor:
      sendingReply || !replyText.trim() ? "not-allowed" : "pointer",
    fontSize: "14px",
    fontWeight: 500,
  }}
>
  {sendingReply ? "Envoi en cours…" : "Envoyer la réponse"}
</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
