// app/admin/investments/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "../AdminNav";
import { apiGet, apiPost, apiPatch } from "../../../lib/api";

type InvestmentStatus = "PENDING" | "ACTIVE" | "REJECTED" | "CLOSED";

type AdminInvestment = {
  id: number;
  principalXOF: number;
  status: InvestmentStatus;
  createdAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  user: {
    id: number;
    fullName: string;
    phone: string;
    email?: string | null;
  };
};

type AdminInvestmentsResponse = {
  success: boolean;
  data: {
    totalCount: number;
    limit: number;
    offset: number;
    investments: AdminInvestment[];
  };
};

const formatXOF = (n: number) =>
  n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " XOF";

type FilterStatus = InvestmentStatus | "ALL";

export default function AdminInvestmentsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("PENDING");
  const [investments, setInvestments] = useState<AdminInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // 🔐 Vérif simple côté client (ADMIN seulement)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("sbc_user");
    if (!raw) {
      router.push("/login");
      return;
    }
    try {
      const user = JSON.parse(raw);
      if (user.role !== "ADMIN") {
        router.push("/dashboard");
      }
    } catch {
      router.push("/login");
    }
  }, [router]);

  async function loadData(filter: FilterStatus) {
    try {
      setLoading(true);
      setError(null);

      // ⚠️ IMPORTANT : ne pas envoyer status=ALL
      const query =
        filter === "ALL" ? "" : `?status=${encodeURIComponent(filter.toString())}`;

      const res = await apiGet<AdminInvestmentsResponse>(
        `/api/admin/investments${query}`
      );

      if (!res.success) {
        throw new Error("Réponse API non réussie.");
      }

      setInvestments(res.data.investments);
      // Si tu veux, tu peux aussi stocker res.data.totalCount, limit, offset
    } catch (err: any) {
      console.error("Erreur chargement investments admin:", err);
      setError(
        err.message || "Erreur lors du chargement des investissements."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData(statusFilter);
  }, [statusFilter]);

  async function changeStatus(
    id: number,
    newStatus: "ACTIVE" | "REJECTED" | "CLOSED"
  ) {
    try {
      setActionLoadingId(id);
      setError(null);

      const res = await apiPatch<{
        success: boolean;
        investment: AdminInvestment;
        message?: string;
      }>(`/api/admin/investments/${id}/status`, {
        status: newStatus,
      });

      if (!res.success) {
        throw new Error(res.message || "Erreur API lors de la mise à jour.");
      }

      setInvestments((prev) =>
        prev.map((inv) => (inv.id === id ? res.investment : inv))
      );
    } catch (err: any) {
      console.error("Erreur changement de statut investment:", err);
      setError(
        err.message ||
          "Erreur lors de la mise à jour du statut d'investissement."
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  const filters: FilterStatus[] = [
    "PENDING",
    "ACTIVE",
    "REJECTED",
    "CLOSED",
    "ALL",
  ];

  return (
    <main className="w-full min-h-screen px-4 sm:px-6 py-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 md:gap-8">
        {/* MENU ADMIN COMMUN */}
        <AdminNav />

        {/* HEADER */}
        <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-7 shadow-[0_20px_55px_rgba(0,0,0,0.9)] backdrop-blur-lg flex flex-col gap-2">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sbc-gold">
            Administration · Investissements
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
            Validation des paliers clients
          </h1>
          <p className="text-xs sm:text-sm text-sbc-muted max-w-2xl leading-relaxed">
            Les demandes d&apos;investissement apparaissent d&apos;abord en
            statut{" "}
            <span className="text-sbc-gold font-semibold">PENDING</span>. Vous
            ne validez un palier qu&apos;après avoir confirmé la réception des
            fonds (Wave, etc.). Une fois validé, l&apos;investissement passe en
            statut{" "}
            <span className="text-sbc-gold font-semibold">ACTIVE</span>, puis
            peut être <span className="text-sbc-gold font-semibold">CLOSED</span>{" "}
            en fin de cycle.
          </p>
        </section>

        {/* FILTRES */}
        <section className="bg-sbc-bgSoft/50 border border-sbc-border rounded-3xl p-4 sm:p-5 shadow-[0_16px_45px_rgba(0,0,0,0.85)] flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 items-center">
            {filters.map((f) => {
              const active = statusFilter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-[11px] md:text-xs border transition ${
                    active
                      ? "border-sbc-gold bg-sbc-gold text-sbc-bg font-semibold"
                      : "border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft/70"
                  }`}
                >
                  {f === "ALL" ? "Tous" : f}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="text-[11px] md:text-xs text-red-300 bg-red-950/30 border border-red-700/50 rounded-2xl px-3 py-2">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-[11px] text-sbc-muted">Chargement…</div>
          )}
        </section>

        {/* TABLEAU INVESTISSEMENTS */}
        <section className="bg-sbc-bgSoft/50 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-6 shadow-[0_18px_55px_rgba(0,0,0,0.9)] flex flex-col gap-4">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            Liste des investissements
          </h2>

          {investments.length === 0 && !loading ? (
            <p className="text-[11px] md:text-xs text-sbc-muted">
              Aucun investissement à afficher pour ce filtre.
            </p>
          ) : (
            <div className="w-full overflow-x-auto rounded-2xl border border-sbc-border/60 bg-sbc-bgSoft/30">
              <table className="min-w-[900px] text-[11px] md:text-xs text-sbc-muted border-collapse">
                <thead>
                  <tr className="bg-sbc-bgSoft/70 text-sbc-gold">
                    <Th>ID</Th>
                    <Th>Client</Th>
                    <Th>Téléphone</Th>
                    <Th>Email</Th>
                    <Th>Montant</Th>
                    <Th>Statut</Th>
                    <Th>Demandé le</Th>
                    <Th>Validé / Rejeté le</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-t border-sbc-border/40 hover:bg-sbc-bgSoft/40 transition"
                    >
                      <Td>{inv.id}</Td>
                      <Td className="text-sbc-text">
                        {inv.user?.fullName || "-"}
                      </Td>
                      <Td>{inv.user?.phone || "-"}</Td>
                      <Td>{inv.user?.email || "-"}</Td>
                      <Td className="text-sbc-gold font-semibold">
                        {formatXOF(inv.principalXOF)}
                      </Td>
                      <Td>
                        <StatusBadge status={inv.status} />
                      </Td>
                      <Td>
                        {new Date(inv.createdAt).toLocaleString("fr-FR")}
                      </Td>
                      <Td>
                        {inv.status === "ACTIVE" && inv.approvedAt
                          ? new Date(inv.approvedAt).toLocaleString("fr-FR")
                          : inv.status === "REJECTED" && inv.rejectedAt
                          ? new Date(inv.rejectedAt).toLocaleString("fr-FR")
                          : "-"}
                      </Td>
                      <Td>
                        {inv.status === "PENDING" ? (
                          <div className="flex flex-wrap gap-1">
                            <button
                              disabled={actionLoadingId === inv.id}
                              onClick={() => changeStatus(inv.id, "ACTIVE")}
                              className="px-2 py-1 rounded-full border border-emerald-500/60 text-[10px] text-emerald-300 hover:bg-emerald-900/30 disabled:opacity-60"
                            >
                              {actionLoadingId === inv.id
                                ? "Validation…"
                                : "Valider (fonds reçus)"}
                            </button>
                            <button
                              disabled={actionLoadingId === inv.id}
                              onClick={() => changeStatus(inv.id, "REJECTED")}
                              className="px-2 py-1 rounded-full border border-red-500/60 text-[10px] text-red-300 hover:bg-red-900/30 disabled:opacity-60"
                            >
                              {actionLoadingId === inv.id
                                ? "Rejet…"
                                : "Rejeter"}
                            </button>
                          </div>
                        ) : inv.status === "ACTIVE" ? (
                          <button
                            disabled={actionLoadingId === inv.id}
                            onClick={() => changeStatus(inv.id, "CLOSED")}
                            className="px-2 py-1 rounded-full border border-sbc-border/80 text-[10px] text-sbc-muted hover:bg-sbc-bgSoft/80 disabled:opacity-60"
                          >
                            {actionLoadingId === inv.id
                              ? "Clôture…"
                              : "Clôturer (fin de cycle)"}
                          </button>
                        ) : (
                          <span className="text-[10px] text-sbc-muted">
                            Aucune action disponible
                          </span>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-[10px] md:text-[11px] text-sbc-muted leading-relaxed">
            Ne validez un investissement en statut{" "}
            <span className="text-sbc-gold font-semibold">ACTIVE</span>{" "}
            qu&apos;une fois le dépôt effectivement reçu sur les comptes de
            Smart Business Corp. Les investissements{" "}
            <span className="text-sbc-gold font-semibold">REJECTED</span>{" "}
            peuvent faire l&apos;objet d&apos;un suivi manuel avec le client
            (explication, nouvelle tentative, etc.). Les investissements{" "}
            <span className="text-sbc-gold font-semibold">CLOSED</span> sont
            considérés comme terminés.
          </p>
        </section>
      </div>
    </main>
  );
}

/* UI helpers */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="p-2 text-left font-medium border-b border-sbc-border/40 text-sbc-gold uppercase text-[10px] md:text-[11px] whitespace-nowrap">
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

function StatusBadge({ status }: { status: InvestmentStatus }) {
  const base =
    "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px]";

  if (status === "PENDING") {
    return (
      <span
        className={`${base} border-amber-400/70 bg-amber-900/30 text-amber-200`}
      >
        En attente
      </span>
    );
  }
  if (status === "ACTIVE") {
    return (
      <span
        className={`${base} border-emerald-500/70 bg-emerald-900/30 text-emerald-300`}
      >
        Actif
      </span>
    );
  }
  if (status === "REJECTED") {
    return (
      <span
        className={`${base} border-red-500/70 bg-red-900/30 text-red-300`}
      >
        Rejeté
      </span>
    );
  }
  return (
    <span
      className={`${base} border-sbc-border/70 bg-sbc-bgSoft/50 text-sbc-muted`}
    >
      {status}
    </span>
  );
}
