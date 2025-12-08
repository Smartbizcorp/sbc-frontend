"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserInfo {
  id: number;
  fullName: string;
  phone: string;
  email?: string | null;
}

type InvestmentStatus = "PENDING" | "ACTIVE" | "REJECTED" | "CLOSED";

interface Investment {
  id: number;
  principalXOF: number;
  status: InvestmentStatus;
  createdAt: string;
  endDate: string;
}

const TIERS = [10000, 25000, 50000, 100000, 250000, 500000];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const formatXOF = (amount: number) =>
  amount.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " XOF";

// Helper sécurisé JSON
async function fetchJson(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  const type = res.headers.get("content-type") || "";

  if (!type.includes("application/json")) {
    const text = await res.text();
    console.error("Réponse non JSON:", url, text);
    throw new Error("Réponse non JSON du serveur.");
  }

  return { res, json: await res.json() };
}

export default function InvestirPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [investments, setInvestments] = useState<Investment[]>([]);

  // Auto-logout 3 min
  const [lastActivity, setLastActivity] = useState(Date.now());

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (_) {}
    localStorage.removeItem("sbc_user");
    router.push("/login");
  };

  useEffect(() => {
    const reset = () => setLastActivity(Date.now());
    ["click", "keydown", "mousemove", "scroll"].forEach((ev) =>
      window.addEventListener(ev, reset)
    );

    const interval = setInterval(() => {
      if ((Date.now() - lastActivity) / 60000 >= 3) handleLogout();
    }, 30000);

    return () => {
      ["click", "keydown", "mousemove", "scroll"].forEach((ev) =>
        window.removeEventListener(ev, reset)
      );
      clearInterval(interval);
    };
  }, [lastActivity]); // eslint-disable-line react-hooks/exhaustive-deps

  // Charge user + investissements
  useEffect(() => {
    async function load() {
      try {
        const rawUser = localStorage.getItem("sbc_user");
        if (!rawUser) {
          router.push("/login");
          return;
        }

        const parsedUser = JSON.parse(rawUser) as UserInfo;
        setUser(parsedUser);

        const { res, json } = await fetchJson(
          `${API_BASE}/api/investments`,
          { credentials: "include" }
        );

        if (!res.ok || !json.success) {
          throw new Error(json.message || "Erreur chargement investissements.");
        }

        setInvestments(json.investments || []);
      } catch (e: any) {
        setErrorMessage(e.message || "Erreur lors du chargement.");
      }
    }

    load();
  }, [router]);

  // ------------------------------------------------
  //   VALIDER LE PALIER  →  CRÉER INVEST + REDIRECT
  // ------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedTier) {
      setErrorMessage("Veuillez sélectionner un palier.");
      return;
    }

    try {
      setLoading(true);

      const { res, json } = await fetchJson(`${API_BASE}/api/investments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amountXOF: selectedTier }), // ✅ conforme à ton backend
      });

      if (!res.ok) {
        throw new Error(json.message || "Erreur lors de la création de l'investissement.");
      }

      if (!json.success) {
        throw new Error(json.message || "Erreur lors de la création de l'investissement.");
      }

      const investmentId = json.investment.id as number;

      // 🔁 Optionnel : on met à jour la liste locale (au cas où tu reviens avec back)
      setInvestments((prev) => [json.investment, ...prev]);

      // 👉 Redirection vers la page de choix du moyen de paiement
router.push(`/paiement/${investmentId}`);
return;

    } catch (e: any) {
  console.error("ERR INVEST:", e);   // ⬅️ AJOUT IMPORTANT
  setErrorMessage(e.message || "Erreur lors de l'enregistrement.");
} finally {
  setLoading(false);
}

  };

  if (errorMessage && !user) {
    return (
      <div className="max-w-xl mx-auto bg-sbc-bgSoft/60 border border-red-700/50 rounded-3xl p-5 text-sm text-red-300 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        {errorMessage}
      </div>
    );
  }

  const hasPending = investments.some((inv) => inv.status === "PENDING");

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      {/* HEADER */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-7 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-lg flex flex-col md:flex-row md:justify-between gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-[11px] uppercase tracking-[0.25em] text-sbc-gold">
            Investissements
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold">
            Lancer un investissement
          </h1>
          <p className="text-xs md:text-sm text-sbc-muted max-w-xl leading-relaxed">
            Choisissez un palier parmi ceux proposés. Chaque palier suit une
            stratégie de{" "}
            <span className="text-sbc-gold font-semibold">90&nbsp;jours</span>{" "}
            orientée vers la protection du capital. Votre demande passe d&apos;abord
            en statut{" "}
            <span className="text-sbc-gold font-semibold">PENDING</span>,
            puis devient <span className="text-sbc-gold font-semibold">ACTIVE</span>{" "}
            une fois les fonds confirmés par l&apos;administration.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1 text-xs md:text-sm">
          <p className="text-sbc-muted">Compte</p>
          {user && (
            <>
              <p className="text-sbc-text">
                {user.fullName} · {user.phone}
              </p>
              {user.email && (
                <p className="text-sbc-muted text-[11px]">{user.email}</p>
              )}
            </>
          )}

          <div className="flex gap-2 mt-2">
            <Link
              href="/dashboard"
              className="px-3 py-1 rounded-full border border-sbc-border text-[11px] text-sbc-muted hover:bg-sbc-bgSoft transition"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-full border border-red-500/70 text-[11px] text-red-300 hover:bg-red-900/40 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </section>

      {/* FORMULAIRE */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-5">
        <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
          Sélection du palier
        </h2>

        {hasPending && (
          <div className="text-[11px] md:text-xs text-amber-200 bg-amber-900/30 border border-amber-500/60 rounded-2xl px-3 py-2">
            Vous avez déjà au moins un investissement{" "}
            <span className="font-semibold">en attente</span>. Il deviendra
            ACTIVE après validation de vos fonds.
          </div>
        )}

        {successMessage && (
          <div className="text-emerald-400 text-xs bg-emerald-950/30 border border-emerald-700/50 rounded-2xl px-3 py-2">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="text-red-400 text-xs bg-red-950/30 border border-red-700/50 rounded-2xl px-3 py-2">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TIERS.map((amount) => {
              const active = selectedTier === amount;
              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setSelectedTier(amount)}
                  className={`rounded-2xl border px-3 py-3 text-xs md:text-sm transition ${
                    active
                      ? "border-sbc-gold bg-sbc-gold/10 text-sbc-gold"
                      : "border-sbc-border bg-sbc-bgSoft text-sbc-muted hover:border-sbc-gold/60"
                  }`}
                >
                  <p className="font-semibold">{formatXOF(amount)}</p>
                  <p className="text-[10px] text-sbc-muted">
                    Durée : 90 jours · validation admin
                  </p>
                </button>
              );
            })}
          </div>

          <div className="border border-sbc-border rounded-2xl p-4 text-xs text-sbc-muted bg-sbc-bgSoft/40">
            {selectedTier ? (
              <>
                Palier sélectionné :{" "}
                <span className="text-sbc-gold font-semibold">
                  {formatXOF(selectedTier)}
                </span>
                . Votre demande passera en statut{" "}
                <span className="text-sbc-gold font-semibold">PENDING</span>,
                puis sera validée après réception de vos fonds.
              </>
            ) : (
              <>Sélectionnez un palier pour continuer.</>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedTier || loading}
            className="px-4 py-2 rounded-full bg-sbc-gold text-sbc-bg border border-sbc-gold text-xs md:text-sm font-semibold hover:bg-sbc-goldSoft transition disabled:opacity-60"
          >
            {loading ? "Envoi..." : "Valider ce palier"}
          </button>
        </form>
      </section>

      {/* LISTE EXISTANTS */}
      <section className="bg-sbc-bgSoft/50 border border-sbc-border rounded-3xl p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.85)]">
        <h2 className="text-sm md:text-base font-semibold text-sbc-gold mb-3">
          Vos investissements
        </h2>

        {investments.length === 0 ? (
          <p className="text-xs text-sbc-muted">
            Aucun investissement pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto border border-sbc-border/60 rounded-2xl bg-sbc-bgSoft/40">
            <table className="w-full text-[11px] md:text-xs text-sbc-muted">
              <thead>
                <tr className="bg-sbc-bgSoft/70 text-sbc-gold">
                  <th className="p-2 text-left">Montant</th>
                  <th className="p-2 text-left">Statut</th>
                  <th className="p-2 text-left">Début</th>
                  <th className="p-2 text-left">Échéance</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-t border-sbc-border/30 hover:bg-sbc-bgSoft/40"
                  >
                    <td className="p-2 text-sbc-text">
                      {formatXOF(inv.principalXOF)}
                    </td>
                    <td className="p-2">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="p-2">
                      {new Date(inv.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="p-2">
                      {new Date(inv.endDate).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-3 text-[10px] md:text-[11px] text-sbc-muted leading-relaxed">
          Un investissement en statut{" "}
          <span className="text-sbc-gold font-semibold">PENDING</span> indique
          que la demande a été enregistrée, mais que les fonds doivent encore
          être confirmés par Smart Business Corp. Un investissement{" "}
          <span className="text-sbc-gold font-semibold">ACTIVE</span> est
          pleinement pris en compte dans la stratégie et dans le calcul des
          gains.
        </p>
      </section>
    </div>
  );
}

/* Badge de statut */

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
