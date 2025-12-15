"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "../AdminNav";
import { apiGet, downloadCguProofPdf } from "@/lib/api";

type RecentLedgerEntry = {
  id: number;
  userId: number;
  type: "CREDIT" | "DEBIT";
  amount: number;
  source: string;
  reference: string | null;
  createdAt: string;
  user: {
    id: number;
    fullName: string;
    phone: string;
  };
};

type AdminDashboardResponse = {
  success: boolean;
  data: {
    totalUsers: number;
    totalInvested: number;
    totalAccruedGain: number;
    totalWalletBalance: number;
    totalWithdrawalsAmount: number;
    totalWithdrawalsProcessed: number;
    totalWithdrawalsPending: number;
    recentLedger: RecentLedgerEntry[];
    pendingInvestmentsCount: number;
  };
};

type CguAcceptance = {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  acceptCguAt: string | null;
  cguVersion: string | null;
  cguHash: string | null;
  cguIp: string | null;
  cguUserAgent: string | null;
  createdAt: string;
};

type AdminCguAcceptancesResponse = {
  success: boolean;
  data: CguAcceptance[];
};

const formatXOF = (n: number) =>
  n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " XOF";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminDashboardResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ preuves CGU
  const [cgu, setCgu] = useState<CguAcceptance[]>([]);
  const [cguLoading, setCguLoading] = useState(false);
  const [cguError, setCguError] = useState<string | null>(null);

  // 🔐 Vérif simple côté client : admin uniquement
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

  // 🔁 Chargement dashboard admin
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiGet<AdminDashboardResponse>("/api/admin/dashboard");
        if (!res.success) throw new Error("Réponse API non réussie.");
        setData(res.data);
      } catch (err: any) {
        console.error("Erreur chargement admin dashboard:", err);
        setError(err.message || "Erreur lors du chargement du dashboard admin.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // 🔁 Chargement preuves CGU
  useEffect(() => {
    const loadCgu = async () => {
      try {
        setCguLoading(true);
        setCguError(null);

        const res = await apiGet<AdminCguAcceptancesResponse>(
          "/api/admin/cgu-acceptances"
        );
        if (!res.success) throw new Error("Réponse CGU non réussie.");
        setCgu(res.data || []);
      } catch (err: any) {
        console.error("Erreur chargement preuves CGU:", err);
        setCguError(err.message || "Erreur lors du chargement des preuves CGU.");
      } finally {
        setCguLoading(false);
      }
    };
    loadCgu();
  }, []);

  return (
    <main className="w-full min-h-screen px-4 sm:px-6 py-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 sm:gap-8 md:gap-10">
        <AdminNav />

        {/* 🔹 EN-TÊTE */}
        <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_22px_60px_rgba(0,0,0,0.9)] backdrop-blur-lg">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sbc-gold mb-2">
            Dashboard Admin
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2">
            Vue d’ensemble Smart Business Corp
          </h1>
          <p className="text-xs sm:text-sm text-sbc-muted max-w-2xl leading-relaxed">
            Aperçu global : utilisateurs, investissements, retraits, mouvements
            comptables récents + preuves CGU.
          </p>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-4 sm:p-5 text-[11px] sm:text-xs text-sbc-muted shadow-[0_18px_45px_rgba(0,0,0,0.85)]">
            Chargement…
          </div>
        )}

        {/* ERREUR */}
        {!loading && error && (
          <div className="bg-sbc-bgSoft/60 border border-red-700/50 rounded-3xl p-5 text-[11px] sm:text-sm text-red-300 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            {error}
          </div>
        )}

        {/* CONTENU */}
        {!loading && !error && data && (
          <>
            {/* 🔹 CARTES STATISTIQUES */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              <StatCard label="Utilisateurs" value={data.totalUsers} />
              <StatCard label="Capital investi" value={formatXOF(data.totalInvested)} />
              <StatCard label="Gains cumulés" value={formatXOF(data.totalAccruedGain)} />
              <StatCard label="Solde total wallets" value={formatXOF(data.totalWalletBalance)} />
              <StatCard label="Total retraits" value={formatXOF(data.totalWithdrawalsAmount)} />
              <StatCard label="Retraits traités" value={formatXOF(data.totalWithdrawalsProcessed)} />
              <StatCard label="Retraits en attente" value={formatXOF(data.totalWithdrawalsPending)} />
              <StatCard label="Investissements en attente" value={data.pendingInvestmentsCount} />
            </section>

            {/* 🔹 JOURNAL DES MOUVEMENTS */}
            <section className="bg-sbc-bgSoft/50 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-7 shadow-[0_18px_55px_rgba(0,0,0,0.85)] flex flex-col gap-4">
              <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
                Dernières écritures comptables
              </h2>

              {data.recentLedger.length === 0 ? (
                <p className="text-xs sm:text-sm text-sbc-muted">
                  Aucune écriture comptable récente.
                </p>
              ) : (
                <div className="w-full overflow-x-auto rounded-2xl border border-sbc-border/60 bg-sbc-bgSoft/30">
                  <table className="min-w-[720px] text-[11px] md:text-xs border-collapse text-sbc-muted">
                    <thead>
                      <tr className="bg-sbc-bgSoft/70 text-sbc-gold">
                        <Th>Date</Th>
                        <Th>Utilisateur</Th>
                        <Th>Téléphone</Th>
                        <Th>Type</Th>
                        <Th>Montant</Th>
                        <Th>Source</Th>
                        <Th>Référence</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentLedger.map((e) => (
                        <tr
                          key={e.id}
                          className="border-t border-sbc-border/40 hover:bg-sbc-bgSoft/40 transition"
                        >
                          <Td>{new Date(e.createdAt).toLocaleString("fr-FR")}</Td>
                          <Td className="text-sbc-text">{e.user.fullName}</Td>
                          <Td>{e.user.phone}</Td>
                          <Td>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] border ${
                                e.type === "CREDIT"
                                  ? "border-emerald-500/60 bg-emerald-900/30 text-emerald-300"
                                  : "border-red-500/60 bg-red-900/30 text-red-300"
                              }`}
                            >
                              {e.type}
                            </span>
                          </Td>
                          <Td className="text-sbc-gold font-semibold">{formatXOF(e.amount)}</Td>
                          <Td>{e.source}</Td>
                          <Td>{e.reference || "-"}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* ✅ PREUVES CGU + BOUTON PDF */}
            <section className="bg-sbc-bgSoft/50 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-7 shadow-[0_18px_55px_rgba(0,0,0,0.85)] flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
                  Preuves d’acceptation CGU
                </h2>
                <span className="text-[11px] text-sbc-muted">
                  {cgu.length} enregistrements
                </span>
              </div>

              {cguLoading && (
                <div className="text-[11px] text-sbc-muted">Chargement des preuves CGU…</div>
              )}

              {!cguLoading && cguError && (
                <div className="text-[11px] text-red-300">{cguError}</div>
              )}

              {!cguLoading && !cguError && cgu.length === 0 && (
                <div className="text-[11px] text-sbc-muted">
                  Aucune acceptation CGU enregistrée pour le moment.
                </div>
              )}

              {!cguLoading && !cguError && cgu.length > 0 && (
                <div className="w-full overflow-x-auto rounded-2xl border border-sbc-border/60 bg-sbc-bgSoft/30">
                  <table className="min-w-[980px] text-[11px] md:text-xs border-collapse text-sbc-muted">
                    <thead>
                      <tr className="bg-sbc-bgSoft/70 text-sbc-gold">
                        <Th>User</Th>
                        <Th>Téléphone</Th>
                        <Th>Accepté le</Th>
                        <Th>Version</Th>
                        <Th>Hash</Th>
                        <Th>IP</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {cgu.map((u) => (
                        <tr
                          key={u.id}
                          className="border-t border-sbc-border/40 hover:bg-sbc-bgSoft/40 transition"
                        >
                          <Td className="text-sbc-text">{u.fullName}</Td>
                          <Td>{u.phone}</Td>
                          <Td>
                            {u.acceptCguAt
                              ? new Date(u.acceptCguAt).toLocaleString("fr-FR")
                              : "—"}
                          </Td>
                          <Td>{u.cguVersion ?? "—"}</Td>
                          <Td className="max-w-[280px] truncate">{u.cguHash ?? "—"}</Td>
                          <Td>{u.cguIp ?? "—"}</Td>
                          <Td>
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await downloadCguProofPdf(u.id);
                                } catch (e: any) {
                                  alert(e?.message || "Erreur téléchargement PDF");
                                }
                              }}
                              className="px-3 py-2 rounded-full border border-sbc-gold bg-sbc-bgSoft text-[11px] text-sbc-gold hover:bg-sbc-gold hover:text-sbc-bg transition"
                            >
                              Télécharger preuve CGU
                            </button>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

/* ------------------------ */
/*      COMPONENTS UI       */
/* ------------------------ */

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-4 md:p-5 shadow-[0_20px_55px_rgba(0,0,0,0.9)] flex flex-col gap-1">
      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-sbc-muted">
        {label}
      </p>
      <p className="text-lg md:text-xl font-semibold text-sbc-gold break-words">
        {value}
      </p>
    </div>
  );
}

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
