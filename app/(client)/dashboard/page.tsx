"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { T } from "@/components/T";

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
  minDaysRemaining?: number | null;
  minDaysElapsed?: number | null;
}

const formatXOF = (amount: number) =>
  amount.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " XOF";

// ✅ Sécuriser la lecture JSON
async function safeJson(res: Response) {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Réponse NON JSON :", res.url, text);
    throw new Error("Le serveur a répondu avec un format invalide.");
  }
  return res.json();
}

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

        const json = await safeJson(res);

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
        setErrorMessage(e.message || "Erreur lors du chargement du dashboard.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  // 💬 États de chargement / erreur
  if (loading) {
    return (
      <main className="w-full min-h-[calc(100vh-120px)] px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto text-xs md:text-sm text-sbc-muted">
          <T>Chargement de votre espace Smart Business Corp...</T>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="w-full min-h-[calc(100vh-120px)] px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-xl mx-auto bg-sbc-bgSoft/60 border border-red-700/50 rounded-3xl p-4 md:p-5 text-[11px] md:text-sm text-red-300 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          {errorMessage}
        </div>
      </main>
    );
  }

  if (!data) return null;

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
    minDaysRemaining,
    minDaysElapsed,
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
              <T>Paiement reçu</T>
            </h2>
            <p className="text-[11px] md:text-sm text-sbc-muted leading-relaxed mb-4">
              <T>Merci, votre paiement Wave a bien été pris en compte.</T>{" "}
              <span className="text-sbc-gold font-semibold">
                <T>Votre investissement sera validé manuellement</T>
              </span>{" "}
              <T>par notre équipe dans un délai de</T>{" "}
              <span className="font-semibold">
                <T>5 à 10 minutes</T>
              </span>{" "}
              <T>maximum.</T>
            </p>
            <button
              onClick={() => setShowPaidPopup(false)}
              className="px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs md:text-sm font-semibold hover:bg-sbc-goldSoft transition"
            >
              <T>OK, j&apos;ai compris</T>
            </button>
          </div>
        </div>
      )}

      {/* CONTENU DASHBOARD */}
      <main className="w-full min-h-[calc(100vh-120px)] px-4 sm:px-6 py-6 sm:py-8">
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 md:gap-10">
          {/* HEADER DASHBOARD */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold leading-snug">
                <T>Bonjour,</T>{" "}
                <span className="text-sbc-gold break-words">{user.fullName}</span>
              </h1>

              <p className="text-xs md:text-sm text-sbc-muted max-w-xl leading-relaxed">
                <T>
                  Sur cet écran, vous retrouvez une vue synthétique de votre
                  portefeuille Smart Business Corp : solde disponible, capital
                  investi, gains cumulés et demandes de retrait.
                </T>
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
                  <T>Retraits restants cette semaine :</T>
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

              {/* ⏳ Jours restants (compact) */}
              {typeof minDaysRemaining === "number" && (
                <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-sbc-border bg-sbc-bgSoft/70 px-3 py-1 text-[11px] md:text-xs">
                  <span className="text-sbc-muted">
                    <T>Jours restants :</T>
                  </span>
                  <span className="font-semibold text-sbc-gold">
                    {minDaysRemaining} / 90
                  </span>
                  {typeof minDaysElapsed === "number" && (
                    <span className="text-sbc-muted">
                      <T>(écoulés :</T> {minDaysElapsed})
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 text-xs md:text-sm">
              <p className="text-sbc-muted">
                <T>Compte</T>
              </p>
              <p className="text-sbc-text break-words">
                {user.phone}
                {user.email ? ` · ${user.email}` : ""}
              </p>

              <div className="flex flex-wrap gap-2 mt-1">
                <Link
                  href="/faq"
                  className="text-[11px] md:text-xs text-sbc-muted underline underline-offset-4 hover:text-sbc-gold transition"
                >
                  <T>Voir les règles de fonctionnement</T>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-full border border-red-500/70 text-[11px] md:text-xs text-red-300 hover:bg-red-900/40 transition"
                >
                  <T>Se déconnecter</T>
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
                  <T>{stat.label}</T>
                </p>
                <p className="text-lg md:text-xl font-semibold text-sbc-gold">
                  {stat.value}
                </p>
                <p className="text-[11px] text-sbc-muted leading-relaxed">
                  <T>{stat.sub}</T>
                </p>
              </div>
            ))}
          </section>

          {/* 📊 Investissement en cours – Jours restants */}
          <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-sbc-gold">
                  <T>Investissement en cours</T>
                </p>
                <h2 className="text-sm md:text-base font-semibold text-sbc-text">
                  <T>Progression vers l’échéance (90 jours)</T>
                </h2>
                <p className="text-[11px] text-sbc-muted leading-relaxed max-w-2xl">
                  <T>
                    Les gains sont crédités quotidiennement tant que
                    l’investissement est actif. À l’échéance, l’investissement
                    est clôturé automatiquement et vous recevez une notification.
                  </T>
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-sbc-muted">
                  <T>Investissements actifs</T>
                </p>
                <p className="text-lg md:text-xl font-semibold text-sbc-gold">
                  {activeInvestmentsCount}
                </p>
              </div>
            </div>

            {activeInvestmentsCount <= 0 ||
            typeof minDaysRemaining !== "number" ? (
              <div className="mt-4 rounded-2xl border border-sbc-border bg-sbc-bgSoft/70 px-4 py-3 text-[11px] text-sbc-muted">
                <T>Aucun investissement actif pour le moment.</T>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Jours restants */}
                <div className="rounded-2xl border border-sbc-border bg-sbc-bgSoft/70 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-sbc-muted">
                    <T>Jours restants</T>
                  </p>
                  <p className="mt-1 text-xl font-semibold text-sbc-gold">
                    {minDaysRemaining} / 90
                  </p>
                  <p className="text-[10px] text-sbc-muted mt-1">
                    <T>90 − jours écoulés</T>
                  </p>
                </div>

                {/* Jours écoulés */}
                <div className="rounded-2xl border border-sbc-border bg-sbc-bgSoft/70 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-sbc-muted">
                    <T>Jours écoulés</T>
                  </p>
                  <p className="mt-1 text-xl font-semibold text-sbc-text">
                    {typeof minDaysElapsed === "number" ? minDaysElapsed : 0} / 90
                  </p>
                  <p className="text-[10px] text-sbc-muted mt-1">
                    <T>Depuis le lancement</T>
                  </p>
                </div>

                {/* Statut */}
                <div className="rounded-2xl border border-sbc-border bg-sbc-bgSoft/70 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-sbc-muted">
                    <T>Statut</T>
                  </p>

                  {minDaysRemaining === 0 ? (
                    <>
                      <p className="mt-1 text-sm font-semibold text-red-300">
                        <T>Arrivé à échéance</T>
                      </p>
                      <p className="text-[10px] text-sbc-muted mt-1">
                        <T>
                          Une notification “échéance” sera visible dans Activité
                          récente.
                        </T>
                      </p>
                    </>
                  ) : minDaysRemaining <= 3 ? (
                    <>
                      <p className="mt-1 text-sm font-semibold text-amber-300">
                        <T>Échéance proche</T>
                      </p>
                      <p className="text-[10px] text-sbc-muted mt-1">
                        <T>Plus que</T> {minDaysRemaining}{" "}
                        <T>
                          jour{minDaysRemaining > 1 ? "s" : ""}
                        </T>
                        .
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-1 text-sm font-semibold text-emerald-300">
                        <T>En cours</T>
                      </p>
                      <p className="text-[10px] text-sbc-muted mt-1">
                        <T>Crédit quotidien automatique.</T>
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* BLOC ACTIVITÉ / ACTIONS */}
          <section className="grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-5">
            {/* Activité récente */}
            <div className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
                  <T>Activité récente</T>
                </h2>
                <span className="text-[11px] text-sbc-muted">
                  {activeInvestmentsCount} <T>investissement(s) actif(s)</T>
                </span>
              </div>

              {recentEvents.length === 0 ? (
                <p className="text-[11px] text-sbc-muted">
                  <T>Aucune activité récente pour le moment.</T>
                </p>
              ) : (
                <ul className="flex flex-col gap-3 text-[11px] text-sbc-muted">
                  {recentEvents.map((event, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between gap-3 border-b border-sbc-border/40 pb-2 last:border-b-0"
                    >
                      <div className="flex flex-col">
                        <span className="flex items-center gap-2 text-sbc-text">
                          <T>{event.label}</T>

                          {event.label?.toLowerCase().includes("échéance") && (
                            <span className="px-2 py-0.5 rounded-full border border-sbc-gold/70 bg-sbc-bgSoft text-[9px] font-semibold text-sbc-gold uppercase tracking-wide">
                              <T>Échéance</T>
                            </span>
                          )}
                        </span>

                        <span className="text-[10px] text-sbc-muted">
                          <T>{event.detail}</T>
                        </span>
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
                  <T>Actions rapides</T>
                </p>
                <p className="text-sm md:text-base font-semibold mb-2">
                  <T>Gérer vos flux</T>
                </p>
                <p className="text-[11px] text-sbc-muted leading-relaxed mb-3">
                  <T>
                    Demandez un retrait, lancez un nouvel investissement ou
                    consultez l&apos;historique de vos opérations.
                  </T>
                </p>

                <div className="flex flex-wrap gap-2 text-[11px]">
                  <Link
                    href="/retraits"
                    className="px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg font-semibold hover:bg-sbc-goldSoft hover:text-sbc-bg transition"
                  >
                    <T>Demander un retrait</T>
                  </Link>
                  <Link
                    href="/retraits"
                    className="px-4 py-2 rounded-full border border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft transition"
                  >
                    <T>Historique des retraits</T>
                  </Link>
                  <Link
                    href="/investir"
                    className="px-4 py-2 rounded-full border border-sbc-border text-sbc-muted hover:bg-sbc-bgSoft transition"
                  >
                    <T>Lancer un investissement</T>
                  </Link>
                </div>

                <p className="mt-3 text-[10px] text-sbc-muted">
                  <T>Il vous reste</T>{" "}
                  <span className="text-sbc-gold font-semibold">
                    {remaining} <T>retrait</T>
                    {remaining > 1 ? "s" : ""}{" "}
                  </span>
                  <T>
                    autorisé{remaining > 1 ? "s" : ""} cette semaine.
                  </T>
                </p>
              </div>

              <div className="bg-sbc-bgSoft/70 border border-sbc-border rounded-3xl p-5 shadow-[0_16px_40px_rgba(0,0,0,0.8)] text-[10px] md:text-[11px] text-sbc-muted leading-relaxed">
                <T>
                  Smart Business Corp applique une stratégie orientée vers la
                </T>{" "}
                <span className="text-sbc-gold">
                  <T>
                    protection du capital et l&apos;évitement scrupuleux des pertes
                  </T>
                </span>
                <T>
                  , mais tout investissement comporte un risque. Les montants et
                  gains affichés sont des informations indicatives et peuvent
                  évoluer en fonction des conditions de marché et des décisions de
                  gestion.
                </T>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
