"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Withdrawal {
  id: number;
  amount: number;
  waveNumber: string;
  status: string;
  note?: string | null;
  createdAt: string;
  processedAt?: string | null;
}

interface SBCUser {
  fullName: string;
  phone: string;
}

interface DashboardResponse {
  success: boolean;
  data: {
    walletBalance: number;
  };
}

// ❤️ Toujours utiliser la variable d’environnement
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const formatXOF = (amount: number) =>
  amount.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " XOF";

// Sécuriser la lecture JSON
async function safeJson(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Réponse NON JSON :", text);
    throw new Error("Le serveur a répondu avec un format invalide.");
  }
  return res.json();
}

export default function RetraitsPage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [waveNumber, setWaveNumber] = useState("");
  const [note, setNote] = useState("");

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [user, setUser] = useState<SBCUser | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  // 🔐 Auth + user + chargement initial
  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawUser = localStorage.getItem("sbc_user");
    if (!rawUser) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(rawUser);
      setUser({ fullName: parsed.fullName, phone: parsed.phone });
      setWaveNumber(parsed.phone || "");
    } catch {
      localStorage.removeItem("sbc_user");
      router.push("/login");
      return;
    }

    const loadAll = async () => {
      await Promise.all([loadWithdrawals(), loadWalletBalance()]);
    };

    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadWithdrawals() {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/withdrawals`, {
        credentials: "include",
      });

      const json = await safeJson(res);

      if (res.status === 401) {
        localStorage.removeItem("sbc_user");
        router.push("/login");
        return;
      }

      if (!json.success) throw new Error(json.message);

      setWithdrawals(json.withdrawals);
    } catch (err: any) {
      setErrorMessage(err.message || "Impossible de charger les retraits.");
    } finally {
      setLoading(false);
    }
  }

  async function loadWalletBalance() {
    try {
      const res = await fetch(`${API_URL}/api/dashboard`, {
        credentials: "include",
      });

      const json: DashboardResponse = await safeJson(res);

      if (res.status === 401) {
        localStorage.removeItem("sbc_user");
        router.push("/login");
        return;
      }

      if (!json.success) throw new Error("Erreur dashboard.");

      setWalletBalance(json.data.walletBalance);
    } catch (err) {
      console.error("Erreur chargement walletBalance:", err);
      // on ne met pas d'erreur globale ici pour ne pas écraser un éventuel message
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const numericAmount = parseInt(amount.replace(/\s/g, ""), 10);
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error("Veuillez saisir un montant valide.");
      }

      // 🔍 Vérif côté front avec le solde
      if (walletBalance !== null && numericAmount > walletBalance) {
        throw new Error("Solde insuffisant pour effectuer ce retrait.");
      }

      const res = await fetch(`${API_URL}/api/withdrawals`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: numericAmount,
          waveNumber,
          note: note.trim() || undefined,
        }),
      });

      const json: any = await safeJson(res);

      if (res.status === 401) {
        localStorage.removeItem("sbc_user");
        router.push("/login");
        return;
      }

      // ❗ Gestion spécifique du solde insuffisant renvoyé par le backend
      if (!res.ok || !json.success) {
        if (json.code === "INSUFFICIENT_BALANCE") {
          if (typeof json.walletBalance === "number") {
            setWalletBalance(json.walletBalance);
          }
        }
        throw new Error(json.message || "Une erreur est survenue.");
      }

      setSuccessMessage(
        "Votre demande de retrait a été enregistrée. Elle sera traitée lors de la prochaine fenêtre."
      );

      setAmount("");
      setNote("");

      // recharger historique + solde
      await Promise.all([loadWithdrawals(), loadWalletBalance()]);
    } catch (err: any) {
      setErrorMessage(err.message || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sbc_user");
    }
    router.push("/login");
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-0 flex flex-col gap-8 md:gap-10">
      {/* HEADER — identique à la page Investissements */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-7 shadow-[0_22px_60px_rgba(0,0,0,0.9)] backdrop-blur-lg gap-4 md:gap-0">
        <div className="space-y-2">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sbc-gold">
            Retraits
          </p>

          <h1 className="text-2xl sm:text-3xl font-semibold mt-1">
            Demander un retrait
          </h1>

          <p className="text-xs sm:text-sm md:text-sm text-sbc-muted leading-relaxed max-w-2xl mt-1.5">
            Vous pouvez demander un retrait à tout moment. Il sera traité dans
            l’une des fenêtres hebdomadaires prévues par Smart Business Corp.
          </p>

          {/* Solde disponible */}
          <p className="text-[10px] sm:text-[11px] md:text-xs text-sbc-muted mt-2">
            Solde disponible :{" "}
            <span className="text-sbc-gold font-semibold">
              {walletBalance !== null
                ? formatXOF(walletBalance)
                : "Chargement..."}
            </span>
          </p>
        </div>

        {/* SECTION COMPTE À DROITE */}
        <div className="flex flex-col md:items-end mt-2 md:mt-0 gap-2">
          <p className="text-[11px] md:text-sm text-sbc-muted">
            Compte :{" "}
            <span className="text-sbc-text font-medium">
              {user ? `${user.fullName} — ${user.phone}` : "Chargement..."}
            </span>
          </p>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] rounded-full border border-sbc-border hover:bg-sbc-bgSoft/40 transition"
            >
              Dashboard
            </button>

            <button
              onClick={logout}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] rounded-full border border-red-700 text-red-300 hover:bg-red-900/20 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </section>

      {/* FORMULAIRE */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-4">
        {errorMessage && (
          <div className="text-[10px] sm:text-[11px] md:text-xs text-red-400 bg-red-950/30 border border-red-700/50 rounded-2xl px-3 py-2">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="text-[10px] sm:text-[11px] md:text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-700/50 rounded-2xl px-3 py-2">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Montant + Wave */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] md:text-xs text-sbc-muted">
                Montant *
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold"
                placeholder="Ex : 100000"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] md:text-xs text-sbc-muted">
                Numéro Wave *
              </label>
              <input
                type="tel"
                required
                value={waveNumber}
                onChange={(e) => setWaveNumber(e.target.value)}
                className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold"
                placeholder="+221 XX XXX XX XX"
              />
            </div>
          </div>

          {/* Commentaire */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] md:text-xs text-sbc-muted">
              Commentaire (optionnel)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 min-h-[70px] text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold"
              placeholder="Ex : précision ou remarque…"
            />
          </div>

          <p className="text-[10px] sm:text-[11px] text-sbc-muted leading-relaxed">
            Les retraits sont traités selon les règles de gestion du risque et
            la liquidité disponible.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="self-start px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs md:text-sm font-semibold hover:bg-sbc-goldSoft transition disabled:opacity-60"
          >
            {submitting ? "Envoi..." : "Envoyer ma demande"}
          </button>
        </form>
      </section>

      {/* HISTORIQUE */}
      <section className="bg-sbc-bgSoft/50 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.85)] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            Historique de vos retraits
          </h2>
          {loading && (
            <span className="text-[10px] sm:text-[11px] text-sbc-muted">
              Chargement…
            </span>
          )}
        </div>

        {withdrawals.length === 0 && !loading ? (
          <p className="text-[11px] text-sbc-muted">
            Aucun retrait pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-sbc-border/70 bg-sbc-bgSoft/30">
            <table className="w-full min-w-[480px] text-[10px] sm:text-[11px] md:text-xs text-sbc-muted">
              <thead>
                <tr className="bg-sbc-bgSoft/70 text-sbc-gold">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Montant</th>
                  <th className="p-2 text-left">Wave</th>
                  <th className="p-2 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr
                    key={w.id}
                    className="border-t border-sbc-border/40 hover:bg-sbc-bgSoft/40"
                  >
                    <td className="p-2">
                      {new Date(w.createdAt).toLocaleString("fr-FR")}
                    </td>
                    <td className="p-2 text-sbc-gold">
                      {formatXOF(w.amount)}
                    </td>
                    <td className="p-2">{w.waveNumber}</td>
                    <td className="p-2">
                      <span className="inline-flex rounded-full border border-sbc-border/60 px-2 py-0.5 text-[10px]">
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
