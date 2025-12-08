"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface DashboardData {
  user: {
    id: number;
    fullName: string;
    phone: string;
    email?: string | null;
  };
  capitalInvested: number;
  totalGains: number;
  walletBalance: number;
  withdrawalsPending: number;
  activeInvestmentsCount: number;
  recentEvents: {
    type: "WITHDRAWAL" | "INVESTMENT";
    date: string;
    label: string;
    detail: string;
  }[];
  remainingWithdrawals: number;
  weeklyWithdrawalLimit: number;
}

const formatXOF = (amount: number) =>
  amount.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " XOF";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<DashboardData | null>(null);

  // 🔐 auto-logout en cas d'inactivité
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // 🔔 popup "J'ai payé"
  const [showPaidPopup, setShowPaidPopup] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Erreur logout", e);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("sbc_user");
      }
      router.push("/login");
    }
  };

  // 🔐 écoute des interactions pour l’auto-logout
  useEffect(() => {
    const resetActivity = () => setLastActivity(Date.now());

    window.addEventListener("mousemove", resetActivity);
    window.addEventListener("keydown", resetActivity);
    window.addEventListener("click", resetActivity);
    window.addEventListener("scroll", resetActivity);

    const interval = setInterval(() => {
      const now = Date.now();
      const diffMs = now - lastActivity;
      const diffMinutes = diffMs / (1000 * 60);
      if (diffMinutes >= 3) {
        handleLogout();
      }
    }, 30_000);

    return () => {
      window.removeEventListener("mousemove", resetActivity);
      window.removeEventListener("keydown", resetActivity);
      window.removeEventListener("click", resetActivity);
      window.removeEventListener("scroll", resetActivity);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastActivity]);

  // 🔁 popup "paid=1" (retour depuis Wave)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      setShowPaidPopup(true);

      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, []);

  // 🔁 chargement des données dashboard
  useEffect(() => {
    async function load() {
      try {
        if (typeof window === "undefined") return;

        const rawUser = localStorage.getItem("sbc_user");
        if (!rawUser) {
          router.push("/login");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/api/dashboard`, {
          credentials: "include",
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          if (res.status === 401) {
            localStorage.removeItem("sbc_user");
            router.push("/login");
            return;
          }
          throw new Error(
            json.message || "Erreur lors du chargement du dashboard."
          );
        }

        setData(json.data as DashboardData);
      } catch (e: any) {
        console.error(e);
        setErrorMessage(
          e.message || "Erreur lors du chargement du dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="text-xs md:text-sm text-sbc-muted">
        Chargement de votre espace Smart Business Corp...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-xl mx-auto bg-sbc-bgSoft/60 border border-red-700/50 rounded-3xl p-4 md:p-5 text-[11px] md:text-sm text-red-300 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        {errorMessage}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const {
    user,
    capitalInvested,
    totalGains,
    walletBalance,
    withdrawalsPending,
    activeInvestmentsCount,
    recentEvents,
    remainingWithdrawals,
    weeklyWithdrawalLimit,
  } = data;

  const remaining = remainingWithdrawals ?? 0;
  const weeklyLimit = weeklyWithdrawalLimit ?? 2;

  const stats = [
    {
      label: "Solde portefeuille",
      value: formatXOF(walletBalance),
      sub: "Disponible pour retrait ou réinvestissement",
    },
    {
      label: "Capital investi",
      value: formatXOF(capitalInvested),
      sub: "Total des montants actuellement en stratégie",
    },
    {
      label: "Gains cumulés",
      value: formatXOF(totalGains),
      sub: "Depuis le début de votre historique",
    },
    {
      label: "Retraits en cours",
      value: formatXOF(withdrawalsPending),
      sub: "Demandes en attente de traitement",
    },
  ];

  return (
    <>
      {/* 🔔 POPUP PREMIUM APRÈS PAIEMENT */}
      {showPaidPopup && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <div className="max-w-sm mx-4 bg-sbc-bgSoft/95 border border-sbc-gold/70 rounded-3xl p-6 md:p-7 shadow-[0_28px_90px_rgba(0,0,0,0.95)] text-center">
            <h2 className="text-lg md:text-xl font-semibold text-sbc-gold mb-2">
              Paiement reçu
            </h2>
            <p className="text-[11px] md:text-sm text-sbc-muted leading-relaxed mb-4">
              Merci, votre paiement Wave a bien été pris en compte.{" "}
              <span className="text-sbc-gold font-semibold">
                Votre investissement sera validé manuellement
              </span>{" "}
              par notre équipe dans un délai de{" "}
              <span className="font-semibold">5 à 10 minutes</span> maximum.
            </p>
            <button
              onClick={() => setShowPaidPopup(false)}
              className="px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs md:text-sm font-semibold hover:bg-sbc-goldSoft transition"
            >
              OK, j&apos;ai compris
            </button>
          </div>
        </div>
      )}

      {/* CONTENU DASHBOARD */}
      <div className="flex flex-col gap-8 md:gap-10">
        {/* HEADER DASHBOARD */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 🔽 on enlève le rond + le texte "Espace client" */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold leading-snug">
              Bonjour,{" "}
              <span className="text-sbc-gold break-words">
                {user.fullName}
              </span>
            </h1>
            <p className="text-xs md:text-sm text-sbc-muted max-w-xl leading-relaxed">
              Sur cet écran, vous retrouvez une vue synthétique de votre
              portefeuille Smart Business Corp : solde disponible, capital
              investi, gains cumulés et demandes de retrait.
            </p>

            {/* Badge retraits restants */}
            <div
              className={`mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] md:text-xs ${
                remaining > 0
                  ? "border-sbc-gold/70 bg-sbc-bgSoft/70"
                  : "border-red-500/70 bg-red-900/30"
              }`}
            >
              <span
                className={
                  remaining > 0 ? "text-sbc-muted" : "text-red-200/80"
                }
              >
                Retraits restants cette semaine :
              </span>
              <span
                className={
                  remaining > 0
                    ? "font-semibold text-sbc-gold"
                    : "font-semibold text-red-300"
                }
              >
                {remaining} / {weeklyLimit}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-xs md:text-sm">
            <p className="text-sbc-muted">Compte</p>
            <p className="text-sbc-text break-words">
              {user.phone}
              {user.email ? ` · ${user.email}` : ""}
            </p>

            <div className="flex flex-wrap gap-2 mt-1">
              <Link
                href="/faq"
                className="text-[11px] md:text-xs text-sbc-muted underline underline-offset-4 hover:text-sbc-gold transition"
              >
                Voir les règles de fonctionnement
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-full border border-red-500/70 text-[11px] md:text-xs text-red-300 hover:bg-red-900/40 transition"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </section>

        {/* STAT CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-4 md:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] backdrop-blur-lg flex flex-col gap-2"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-sbc-muted">
                {stat.label}
              </p>
              <p className="text-lg md:text-xl font-semibold text-sbc-gold">
                {stat.value}
              </p>
              <p className="text-[11px] text-sbc-muted leading-relaxed">
                {stat.sub}
              </p>
            </div>
          ))}
        </section>

        {/* BLOC ACTIVITÉ / ACTIONS */}
        <section className="grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-5">
          {/* Activité récente */}
          <div className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
                Activité récente
              </h2>
              <span className="text-[11px] text-sbc-muted">
                {activeInvestmentsCount} investissement(s) actif(s)
              </span>
            </div>

            {recentEvents.length === 0 ? (
              <p className="text-[11px] text-sbc-muted">
                Aucune activité récente pour le moment.
              </p>
            ) : (
              <ul className="flex flex-col gap-3 text-[11px] text-sbc-muted">
                {recentEvents.map((event, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between gap-3 border-b border-sbc-border/40 pb-2 last:border-b-0"
                  >
                    <div className="flex flex-col">
                      <span className="text-sbc-text">{event.label}</span>
                      <span className="text-[10px]">{event.detail}</span>
                    </div>
                    <span className="text-[10px] text-sbc-muted whitespace-nowrap">
                      {new Date(event.date).toLocaleString("fr-FR")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions rapides */}
          <div className="flex flex-col gap-4">
            <div className="bg-sbc-bgSoft/70 border border-sbc-border rounded-3xl p-5 shadow-[0_16px_40px_rgba(0,0,0,0.8)]">
              <p className="text-[11px] uppercase tracking-[0.18em] text-sbc-gold mb-1">
                Actions rapides
              </p>
              <p className="text-sm md:text-base font-semibold mb-2">
                Gérer vos flux
              </p>
              <p className="text-[11px] text-sbc-muted leading-relaxed mb-3">
                Demandez un retrait, lancez un nouvel investissement ou
                consultez l&apos;historique de vos opérations.
              </p>

              <div className="flex flex-wrap gap-2 text-[11px]">
                <Link
                  href="/retraits"
                  className="px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg font-semibold hover:bg-sbc-goldSoft hover:text-sbc-bg transition"
                >
                  Demander un retrait
                </Link>
                <Link
                  href="/retraits"
                  className="px-4 py-2 rounded-full border border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft transition"
                >
                  Historique des retraits
                </Link>
                <Link
                  href="/investir"
                  className="px-4 py-2 rounded-full border border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft transition"
                >
                  Lancer un investissement
                </Link>
              </div>

              <p className="mt-3 text-[10px] text-sbc-muted">
                Il vous reste{" "}
                <span className="text-sbc-gold font-semibold">
                  {remaining} retrait{remaining > 1 ? "s" : ""}{" "}
                </span>
                autorisé{remaining > 1 ? "s" : ""} cette semaine.
              </p>
            </div>

            <div className="bg-sbc-bgSoft/70 border border-sbc-border rounded-3xl p-5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] text-[10px] md:text-[11px] text-sbc-muted leading-relaxed">
              Smart Business Corp applique une stratégie orientée vers la{" "}
              <span className="text-sbc-gold">
                protection du capital et l&apos;évitement scrupuleux des pertes
              </span>
              , mais tout investissement comporte un risque. Les montants et
              gains affichés sont des informations indicatives et peuvent
              évoluer en fonction des conditions de marché et des décisions de
              gestion.
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
