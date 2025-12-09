"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type Withdrawal = {
  id: number;
  amount: number;
  status: string; // "PENDING" | "PROCESSED" | "REJECTED" | etc
  createdAt: string;
  processedAt: string | null;
};

type Investment = {
  id: number;
  principalXOF: number;
  status: string; // "PENDING" | "ACTIVE" | "REJECTED" | "CLOSED"
  createdAt: string;
  approvedAt?: string | null;
};

type TransactionRow = {
  id: string;
  date: string; // ISO
  kind: "INVESTMENT" | "WITHDRAWAL";
  nature: string; // "Investissement" | "Retrait"
  label: string; // texte affiché (Retrait demandé, Retrait traité, etc.)
  amount: number;
  statusLabel: string;
  statusTone: "none" | "pending" | "approved" | "rejected";
  isPendingWithdrawalRequest?: boolean; // pour l’indicateur visuel
};

type ProfileMini = {
  fullName: string;
  phone: string;
};

// 🔔 Notifications venant de la table Notification
type NotificationItem = {
  id: number;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  readAt: string | null;
};

export default function NotificationsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [profile, setProfile] = useState<ProfileMini | null>(null);

  const [filterPeriod, setFilterPeriod] = useState<"ALL" | "MONTH">("ALL");
  const [filterApprovedOnly, setFilterApprovedOnly] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // ---------------------------------------------------------------------------
  // LOAD DATA (historique + notifications)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        const rawUser = localStorage.getItem("sbc_user");
        if (!rawUser) {
          router.push("/login");
          return;
        }

        setLoading(true);
        setError("");

        const [wRes, iRes, pRes, nRes] = await Promise.all([
          fetch(`${API_URL}/api/withdrawals`, { credentials: "include" }),
          fetch(`${API_URL}/api/investments`, { credentials: "include" }),
          fetch(`${API_URL}/api/profile`, { credentials: "include" }),
          fetch(`${API_URL}/api/notifications`, { credentials: "include" }),
        ]);

        // Si une des requêtes renvoie 401 → déconnexion
        if (
          wRes.status === 401 ||
          iRes.status === 401 ||
          pRes.status === 401 ||
          nRes.status === 401
        ) {
          localStorage.removeItem("sbc_user");
          router.push("/login");
          return;
        }

        const [wJson, iJson, pJson, nJson] = await Promise.all([
          wRes.json(),
          iRes.json(),
          pRes.json(),
          nRes.json(),
        ]);

        if (!wRes.ok || !wJson.success) {
          throw new Error(wJson.message || "Erreur chargement retraits.");
        }
        if (!iRes.ok || !iJson.success) {
          throw new Error(iJson.message || "Erreur chargement investissements.");
        }
        if (!pRes.ok || !pJson.success) {
          throw new Error(pJson.message || "Erreur chargement profil.");
        }
        if (!nRes.ok || !nJson.success) {
          throw new Error(
            nJson.message || "Erreur chargement des notifications."
          );
        }

        setWithdrawals(wJson.withdrawals || []);
        setInvestments(iJson.investments || []);
        setProfile({
          fullName: pJson.profile.fullName,
          phone: pJson.profile.phone,
        });

        // 🆕 notifications système
        setNotifications(nJson.notifications || []);
      } catch (err: any) {
        console.error(err);
        setError(
          err?.message || "Erreur lors du chargement des notifications."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  // ---------------------------------------------------------------------------
  // BUILD TRANSACTIONS TIMELINE
  // ---------------------------------------------------------------------------

  const transactions: TransactionRow[] = useMemo(() => {
    const rows: TransactionRow[] = [];

    // 👉 INVESTISSEMENTS : une seule ligne
    for (const inv of investments) {
      const status = (inv.status || "").toUpperCase();

      let statusTone: TransactionRow["statusTone"] = "none";
      let statusLabel = "Inconnu";

      if (status === "PENDING") {
        statusTone = "pending";
        statusLabel = "En attente de validation";
      } else if (status === "ACTIVE" || status === "CLOSED") {
        statusTone = "approved";
        statusLabel = "Approuvé";
      } else if (status === "REJECTED") {
        statusTone = "rejected";
        statusLabel = "Rejeté";
      }

      rows.push({
        id: `INV-${inv.id}`,
        date: inv.createdAt,
        kind: "INVESTMENT",
        nature: "Investissement",
        label: "Investissement",
        amount: inv.principalXOF,
        statusLabel,
        statusTone,
      });
    }

    // 👉 RETRAITS : deux lignes
    for (const w of withdrawals) {
      const status = (w.status || "").toUpperCase();

      // Ligne 1 : demande de retrait
      rows.push({
        id: `W-${w.id}-REQ`,
        date: w.createdAt,
        kind: "WITHDRAWAL",
        nature: "Retrait",
        label: "Retrait demandé",
        amount: w.amount,
        statusLabel:
          status === "PENDING"
            ? "En attente de traitement"
            : status === "PROCESSED" || status === "APPROVED"
            ? "Traité"
            : status === "REJECTED"
            ? "Rejeté"
            : "Enregistré",
        statusTone: status === "PENDING" ? "pending" : "none",
        isPendingWithdrawalRequest: status === "PENDING",
      });

      // Ligne 2 : traitement, seulement si processedAt existe
      if (w.processedAt) {
        let finalTone: TransactionRow["statusTone"] = "approved";
        let finalLabel = "Retrait approuvé";

        if (status === "REJECTED") {
          finalTone = "rejected";
          finalLabel = "Retrait rejeté";
        }

        rows.push({
          id: `W-${w.id}-FINAL`,
          date: w.processedAt,
          kind: "WITHDRAWAL",
          nature: "Retrait",
          label: "Retrait traité",
          amount: w.amount,
          statusLabel: finalLabel,
          statusTone: finalTone,
        });
      }
    }

    // Tri décroissant par date
    rows.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return rows;
  }, [investments, withdrawals]);

  // ---------------------------------------------------------------------------
  // FILTERS
  // ---------------------------------------------------------------------------

  const filteredTransactions = useMemo(() => {
    let list = [...transactions];

    // Filtre "transactions du mois"
    if (filterPeriod === "MONTH") {
      const now = new Date();
      const m = now.getMonth();
      const y = now.getFullYear();

      list = list.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === m && d.getFullYear() === y;
      });
    }

    // Filtre "approuvés uniquement"
    if (filterApprovedOnly) {
      list = list.filter((t) => t.statusTone === "approved");
    }

    return list;
  }, [transactions, filterPeriod, filterApprovedOnly]);

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <main className="w-full min-h-[calc(100vh-120px)] px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto text-xs md:text-sm text-sbc-muted">
          Chargement des notifications...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full min-h-[calc(100vh-120px)] px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto text-xs md:text-sm text-red-400">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-[calc(100vh-120px)] px-4 sm:px-6 py-6 sm:py-8">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 md:gap-10">
        {/* HEADER (léger ajustement pour coller aux autres pages) */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-sbc-gold">
              Compte
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">
              Notifications &amp; historique
            </h1>
            <p className="text-xs md:text-sm text-sbc-muted max-w-xl mt-2 leading-relaxed">
              Retrouvez ici vos notifications importantes (validations / rejets)
              ainsi que toutes les opérations financières liées à votre compte :
              investissements lancés et demandes de retrait (avec leur statut
              final).
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            {profile && (
              <div className="text-xs md:text-sm text-sbc-muted text-right">
                <p>Client</p>
                <p className="text-sbc-text font-medium">
                  {profile.fullName}
                </p>
                <p className="text-[11px]">{profile.phone}</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mt-1 inline-flex items-center gap-2 rounded-full border border-sbc-gold px-4 py-1.5 text-[11px] md:text-xs text-sbc-gold hover:bg-sbc-gold hover:text-sbc-bgSoft transition"
            >
              <span>⬅ Retour au Dashboard</span>
            </button>
          </div>
        </section>

        {/* 🆕 SECTION NOTIFICATIONS SYSTÈME */}
        <section className="bg-sbc-bgSoft/70 border border-sbc-border rounded-3xl p-4 md:p-6 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
              Notifications récentes
            </h2>
            <p className="text-[11px] md:text-xs text-sbc-muted">
              {notifications.length} notification
              {notifications.length > 1 ? "s" : ""}
            </p>
          </div>

          {notifications.length === 0 ? (
            <p className="text-xs md:text-sm text-sbc-muted">
              Vous n&apos;avez encore aucune notification.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-2xl border px-3 py-2.5 text-xs md:text-sm bg-sbc-bgSoft/80 ${
                    n.readAt ? "border-sbc-border/70" : "border-sbc-gold/80"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5 gap-2">
                    <span className="font-semibold text-sbc-text">
                      {n.title}
                    </span>
                    <span className="text-[10px] md:text-[11px] text-sbc-muted">
                      {new Date(n.createdAt).toLocaleString("fr-FR")}
                    </span>
                  </div>

                  <p className="text-sbc-muted text-[11px] md:text-xs">
                    {n.message}
                  </p>

                  {!n.readAt && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-sbc-gold">
                      <span className="h-1.5 w-1.5 rounded-full bg-sbc-gold animate-pulse" />
                      Nouveau
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FILTRES (B : transactions du mois + approuvées uniquement) */}
        <section className="bg-sbc-bgSoft/70 border border-sbc-border rounded-3xl p-4 md:p-5 flex flex-col gap-3">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            Filtres
          </h2>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterPeriod("ALL")}
                className={`px-3 py-1.5 rounded-full text-[11px] md:text-xs border transition ${
                  filterPeriod === "ALL"
                    ? "bg-sbc-gold text-sbc-bgSoft border-sbc-gold"
                    : "bg-transparent text-sbc-text border-sbc-border hover:bg-sbc-bgSoft/60"
                }`}
              >
                Toutes les transactions
              </button>
              <button
                type="button"
                onClick={() => setFilterPeriod("MONTH")}
                className={`px-3 py-1.5 rounded-full text-[11px] md:text-xs border transition ${
                  filterPeriod === "MONTH"
                    ? "bg-sbc-gold text-sbc-bgSoft border-sbc-gold"
                    : "bg-transparent text-sbc-text border-sbc-border hover:bg-sbc-bgSoft/60"
                }`}
              >
                Transactions du mois
              </button>
            </div>

            <label className="inline-flex items-center gap-2 text-[11px] md:text-xs text-sbc-muted cursor-pointer">
              <input
                type="checkbox"
                checked={filterApprovedOnly}
                onChange={(e) => setFilterApprovedOnly(e.target.checked)}
                className="rounded border-sbc-border bg-sbc-bgSoft text-sbc-gold focus:ring-sbc-gold"
              />
              <span>Afficher uniquement les transactions approuvées</span>
            </label>
          </div>
        </section>

        {/* LISTE DES TRANSACTIONS (C : indicateur visuel pour retraits en attente) */}
        <section className="bg-sbc-bgSoft/70 border border-sbc-border rounded-3xl p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
              Historique détaillé
            </h2>
            <p className="text-[11px] md:text-xs text-sbc-muted">
              {filteredTransactions.length} ligne
              {filteredTransactions.length > 1 ? "s" : ""}
            </p>
          </div>

          {filteredTransactions.length === 0 ? (
            <p className="text-xs md:text-sm text-sbc-muted">
              Aucune transaction à afficher avec ces filtres.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-sbc-border/40">
              {filteredTransactions.map((t) => {
                const d = new Date(t.date);
                const dateStr = d.toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
                const timeStr = d.toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const statusBase =
                  "px-2.5 py-0.5 rounded-full text-[10px] md:text-[11px] border";

                const statusClass =
                  t.statusTone === "pending"
                    ? `${statusBase} border-amber-500/70 text-amber-300 bg-amber-900/20`
                    : t.statusTone === "approved"
                    ? `${statusBase} border-emerald-500/70 text-emerald-300 bg-emerald-900/20`
                    : t.statusTone === "rejected"
                    ? `${statusBase} border-red-500/70 text-red-300 bg-red-900/20`
                    : `${statusBase} border-sbc-border/60 text-sbc-muted bg-sbc-bgSoft/40`;

                return (
                  <div
                    key={t.id}
                    className={`flex flex-col md:flex-row md:items-center md:justify-between gap-2 py-3 ${
                      t.isPendingWithdrawalRequest
                        ? "border-l-2 border-l-amber-400/80 bg-sbc-bgSoft/70"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Indicateur visuel pour retrait en attente */}
                      {t.isPendingWithdrawalRequest && (
                        <span className="mt-1 inline-flex h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
                      )}
                      <div>
                        <p className="text-[11px] md:text-xs text-sbc-muted">
                          {dateStr} à {timeStr}
                        </p>
                        <p className="text-xs md:text-sm text-sbc-text font-medium">
                          {t.nature} — {t.label}
                        </p>
                        {t.kind === "WITHDRAWAL" &&
                          t.isPendingWithdrawalRequest && (
                            <p className="text-[10px] text-amber-300/90 mt-0.5">
                              En attente de validation par un administrateur.
                            </p>
                          )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 md:gap-6">
                      <div className="text-xs md:text-sm text-sbc-text font-semibold">
                        {t.amount.toLocaleString("fr-FR")}{" "}
                        <span className="text-[11px] md:text-xs text-sbc-muted">
                          XOF
                        </span>
                      </div>
                      <span className={statusClass}>{t.statusLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
