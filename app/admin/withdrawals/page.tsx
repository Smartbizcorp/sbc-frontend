"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "../AdminNav";
import { apiGet, apiPost } from "@/src/api/client";

type WithdrawalStatus = "PENDING" | "PROCESSED" | "REJECTED";

type AdminWithdrawalUser = {
  id: number;
  fullName: string;
  phone: string;
};

type AdminWithdrawal = {
  id: number;
  userId: number;
  amount: number;
  waveNumber: string;
  note: string | null;
  status: WithdrawalStatus;
  createdAt: string;
  processedAt: string | null;
  user: AdminWithdrawalUser | null; // ⚠️ peut être null → on protège côté UI
};

type AdminWithdrawalsResponse = {
  success: boolean;
  withdrawals: AdminWithdrawal[];
};

const formatXOF = (n: number) =>
  n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " XOF";

const STATUS_LABELS: { [k in WithdrawalStatus]: string } = {
  PENDING: "En attente",
  PROCESSED: "Traité",
  REJECTED: "Rejeté",
};

export default function AdminWithdrawalsPage() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    WithdrawalStatus | "ALL"
  >("PENDING");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // 🔐 Vérif ADMIN
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("sbc_user");

    if (!raw) {
      router.push("/login");
      return;
    }
    try {
      const user = JSON.parse(raw);
      if (user.role !== "ADMIN") router.push("/dashboard");
    } catch {
      router.push("/login");
    }
  }, [router]);

  // 🔁 Chargement des retraits
  const loadWithdrawals = async (status: WithdrawalStatus | "ALL") => {
    try {
      setLoading(true);
      setError(null);

      const query =
        status === "ALL"
          ? "/api/admin/withdrawals?status=ALL"
          : `/api/admin/withdrawals?status=${status}`;

      const res = await apiGet<AdminWithdrawalsResponse>(query);

      if (!res.success) throw new Error("Réponse API non réussie.");
      setWithdrawals(res.withdrawals);
    } catch (err: any) {
      console.error("Erreur admin withdrawals:", err);
      setError(
        err.message || "Erreur lors du chargement des demandes de retrait."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // ✅ Action Valider / Rejeter
  const changeStatus = async (id: number, status: WithdrawalStatus) => {
    try {
      setActionLoadingId(id);
      setError(null);

      // le backend accepte PATCH et POST ; on utilise POST ici
      await apiPost(`/api/admin/withdrawals/${id}/status`, { status });

      // on recharge la liste
      await loadWithdrawals(statusFilter);
    } catch (err: any) {
      console.error("Erreur changement statut retrait:", err);
      setError(
        err.message || "Erreur lors de la mise à jour du statut du retrait."
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* NAVIGATION ADMIN */}
      <AdminNav />

      {/* HEADER */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-6 md:p-7 shadow-[0_22px_60px_rgba(0,0,0,0.9)] backdrop-blur-lg">
        <p className="text-[11px] uppercase tracking-[0.25em] text-sbc-gold">
          Administration
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold mt-1">
          Gestion des retraits
        </h1>
        <p className="text-xs md:text-sm text-sbc-muted leading-relaxed max-w-2xl mt-2">
          Visualisez les demandes de retrait, filtrez par statut et mettez à
          jour leur état (traité / rejeté).
        </p>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mt-4 text-[11px]">
          {(["PENDING", "PROCESSED", "REJECTED", "ALL"] as const).map((s) => {
            const isActive = statusFilter === s;
            const label =
              s === "ALL"
                ? "Tous"
                : STATUS_LABELS[s as WithdrawalStatus];

            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full border text-[11px] ${
                  isActive
                    ? "bg-sbc-gold text-black border-sbc-gold"
                    : "bg-sbc-bgSoft border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft/70"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <div className="text-xs text-sbc-muted">Chargement…</div>
      )}

      {/* ERREUR */}
      {!loading && error && (
        <div className="bg-red-900/30 border border-red-600/40 rounded-2xl p-4 text-red-300 text-xs shadow">
          {error}
        </div>
      )}

      {/* TABLEAU */}
      {!loading && !error && (
        <section className="bg-sbc-bgSoft/50 border border-sbc-border rounded-3xl p-6 md:p-8 shadow-[0_18px_55px_rgba(0,0,0,0.85)]">
          {withdrawals.length === 0 ? (
            <p className="text-xs text-sbc-muted">
              Aucune demande de retrait pour ce filtre.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-sbc-border/60 bg-sbc-bgSoft/30">
              <table className="w-full text-[11px] md:text-xs text-sbc-muted border-collapse">
                <thead>
                  <tr className="bg-sbc-bgSoft/70 text-sbc-gold">
                    <Th>Date</Th>
                    <Th>Client</Th>
                    <Th>Téléphone</Th>
                    <Th>Montant</Th>
                    <Th>Numéro Wave</Th>
                    <Th>Statut</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => (
                    <tr
                      key={w.id}
                      className="border-t border-sbc-border/40 hover:bg-sbc-bgSoft/40 transition"
                    >
                      <Td>
                        {new Date(w.createdAt).toLocaleString("fr-FR")}
                      </Td>

                      {/* ⚠️ w.user peut être null → on protège */}
                      <Td className="text-sbc-text">
                        {w.user?.fullName ?? "Utilisateur inconnu"}
                      </Td>

                      <Td>{w.user?.phone ?? "-"}</Td>

                      <Td className="text-sbc-gold font-semibold">
                        {formatXOF(w.amount)}
                      </Td>

                      <Td>{w.waveNumber}</Td>

                      <Td>
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] uppercase ${
                            w.status === "PENDING"
                              ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40"
                              : w.status === "PROCESSED"
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                              : "bg-red-500/10 text-red-300 border border-red-500/40"
                          }`}
                        >
                          {STATUS_LABELS[w.status]}
                        </span>
                      </Td>

                      <Td>
                        <div className="flex gap-2">
                          {w.status === "PENDING" && (
                            <>
                              <button
                                disabled={actionLoadingId === w.id}
                                onClick={() =>
                                  changeStatus(w.id, "PROCESSED")
                                }
                                className="px-3 py-1 rounded-full text-[10px] bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50"
                              >
                                {actionLoadingId === w.id
                                  ? "Traitement…"
                                  : "Marquer traité"}
                              </button>
                              <button
                                disabled={actionLoadingId === w.id}
                                onClick={() =>
                                  changeStatus(w.id, "REJECTED")
                                }
                                className="px-3 py-1 rounded-full text-[10px] bg-red-500 text-black hover:bg-red-400 disabled:opacity-50"
                              >
                                {actionLoadingId === w.id
                                  ? "Traitement…"
                                  : "Rejeter"}
                              </button>
                            </>
                          )}
                          {w.status !== "PENDING" && (
                            <span className="text-[10px] text-sbc-muted">
                              Action effectuée
                            </span>
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

/* ----------------------- */
/*   COMPOSANTS TABLEAU    */
/* ----------------------- */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="p-2 text-left font-medium text-[10px] md:text-[11px] border-b border-sbc-border/40 uppercase whitespace-nowrap">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={`p-2 border-b border-sbc-border/30 text-[11px] md:text-xs whitespace-nowrap ${className}`}
    >
      {children}
    </td>
  );
}
