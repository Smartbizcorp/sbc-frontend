"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import Link from "next/link";
import { T } from "@/components/T";

function HomeClientTracker() {
  useEffect(() => {
    trackEvent("visit_home");
  }, []);

  return null;
}

export default function HomePage() {
  return (
    <>
      <HomeClientTracker />

      <div className="flex flex-col gap-8 sm:gap-10 lg:gap-14">
        {/* HERO */}
        <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-lg flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-center">
          <div className="flex-1 flex flex-col gap-4">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sbc-gold">
              <T>Plateforme d&apos;investissement</T>
            </p>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
              <T>Faites travailler votre capital avec </T>
              <span className="text-sbc-gold">
                <T>Smart Business Corp</T>
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-sbc-muted leading-relaxed max-w-xl">
              <T>
                Une approche structurée de l&apos;investissement par paliers,
                encadrée par une équipe de traders expérimentés. Suivi
                transparent, gestion du risque disciplinée et retraits organisés
                deux fois par semaine.
              </T>
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                href="/register"
                onClick={() =>
                  trackEvent("click_register", { context: "home_hero" })
                }
                className="px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs md:text-sm font-semibold hover:bg-sbc-goldSoft hover:text-sbc-bg transition"
              >
                <T>Créer un compte</T>
              </Link>

              <Link
                href="/login"
                onClick={() =>
                  trackEvent("click_login", { context: "home_hero" })
                }
                className="px-4 py-2 rounded-full border border-sbc-border text-sbc-muted text-xs md:text-sm hover:bg-sbc-bgSoft transition"
              >
                <T>Accéder à mon espace</T>
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] text-sbc-muted">
              <div>
                <p className="text-sbc-gold font-semibold text-sm">
                  <T>Paliers clairs</T>
                </p>
                <p>
                  <T>De 10 000 à 500 000 XOF.</T>
                </p>
              </div>

              <div>
                <p className="text-sbc-gold font-semibold text-sm">
                  <T>Stratégie encadrée</T>
                </p>
                <p>
                  <T>Gestion du risque avancée.</T>
                </p>
              </div>

              <div>
                <p className="text-sbc-gold font-semibold text-sm">
                  <T>Retraits 2x / semaine</T>
                </p>
                <p>
                  <T>Fenêtres organisées.</T>
                </p>
              </div>
            </div>
          </div>

          {/* Bloc latéral "Info rapide" */}
          <div className="flex-1 w-full">
            <div className="bg-sbc-bg/80 border border-sbc-border rounded-3xl p-4 sm:p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-4 text-xs md:text-sm">
              <p className="text-sbc-gold font-semibold text-sm">
                <T>Investir par paliers, suivre avec sérénité</T>
              </p>

              <p className="text-sbc-muted leading-relaxed">
                <T>
                  Choisissez votre palier, suivez l&apos;évolution de votre
                  capital, effectuez vos retraits dans des fenêtres dédiées : la
                  mécanique est claire, la stratégie est encadrée.
                </T>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-sbc-muted">
                <div className="border border-sbc-border rounded-2xl p-3">
                  <p className="text-sbc-gold font-semibold mb-1">
                    <T>Paliers</T>
                  </p>
                  <p>
                    <T>10 000 · 25 000 · 50 000 XOF</T>
                  </p>
                  <p>
                    <T>100 000 · 250 000 · 500 000 XOF</T>
                  </p>
                </div>

                <div className="border border-sbc-border rounded-2xl p-3">
                  <p className="text-sbc-gold font-semibold mb-1">
                    <T>Horizon</T>
                  </p>
                  <p>
                    <T>Stratégie conçue sur 90 jours</T>
                  </p>
                  <p>
                    <T>Réévaluée en continu.</T>
                  </p>
                </div>
              </div>

              <p className="text-[10px] text-sbc-muted mt-1">
                <T>
                  Important : l&apos;investissement comporte un risque de perte
                  en capital. Notre stratégie vise à{" "}
                </T>
                <span className="text-sbc-gold font-semibold">
                  <T>éviter scrupuleusement la perte du capital</T>
                </span>{" "}
                <T>mais ne peut supprimer totalement le risque.</T>
              </p>
            </div>
          </div>
        </section>

        {/* SECTION "Pourquoi Smart Business Corp ?" */}
        <section className="flex flex-col gap-4 sm:gap-5">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-sbc-gold">
            <T>Pourquoi choisir Smart Business Corp ?</T>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 text-xs md:text-sm">
            <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-4 md:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
              <p className="font-semibold text-sbc-gold mb-1">
                <T>Approche structurée</T>
              </p>
              <p className="text-sbc-muted leading-relaxed">
                <T>
                  Paliers définis, horizon temporel clair, stratégie pensée pour
                  éviter la confusion et les décisions impulsives.
                </T>
              </p>
            </div>

            <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-4 md:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
              <p className="font-semibold text-sbc-gold mb-1">
                <T>Gestion du risque</T>
              </p>
              <p className="text-sbc-muted leading-relaxed">
                <T>
                  Exposition maîtrisée, scénarios prudents, ajustements
                  progressifs plutôt que paris agressifs.
                </T>
              </p>
            </div>

            <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-4 md:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
              <p className="font-semibold text-sbc-gold mb-1">
                <T>Suivi transparent</T>
              </p>
              <p className="text-sbc-muted leading-relaxed">
                <T>
                  Accès permanent à l&apos;évolution de votre portefeuille,
                  retraits encadrés et informations claires sur votre situation.
                </T>
              </p>
            </div>
          </div>
        </section>

        {/* SECTION TABLEAUX GAINS HEBDO + JOURNALIER */}
        <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.9)] backdrop-blur-lg flex flex-col gap-5 sm:gap-6">
          <div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sbc-gold mb-2">
              <T>Projection premium</T>
            </p>

            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
              <T>Gains estimés par palier</T>
            </h2>

            <p className="text-[10px] sm:text-[11px] md:text-xs text-sbc-muted leading-relaxed max-w-2xl">
              <T>
                Modèle basé sur un doublement du capital sur une période de 90
                jours. Les montants ci-dessous répartissent ce résultat final,
                d&apos;abord par semaine, puis par jour, pour offrir une vision
                pédagogique de la progression potentielle.
              </T>
            </p>
          </div>

          {(() => {
            const tiers = [10000, 25000, 50000, 100000, 250000, 500000];
            const totalWeeks = 13;
            const totalDays = 90;

            const formatXOF = (n: number) =>
              n.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " XOF";

            const weeklyRows = tiers.map((amount) => {
              const total = amount * 2;
              const baseWeekly = Math.floor(total / totalWeeks);
              const lastWeek = total - baseWeekly * (totalWeeks - 1);
              return { amount, baseWeekly, lastWeek, total };
            });

            const dailyRows = tiers.map((amount) => {
              const total = amount * 2;
              const dailyGain = Math.round(total / totalDays);
              return { amount, dailyGain };
            });

            return (
              <>
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm md:text-base font-semibold text-sbc-gold">
                    <T>Gains hebdomadaires estimés (total final arrondi)</T>
                  </h3>

                  <div className="overflow-x-auto rounded-2xl border border-sbc-border/50 bg-sbc-bgSoft/40">
                    <table className="w-full min-w-[480px] text-[10px] sm:text-[11px] md:text-xs text-sbc-muted border-collapse">
                      <thead>
                        <tr className="bg-sbc-bgSoft/70 text-sbc-gold">
                          <th className="p-2 text-left font-medium">
                            <T>Palier</T>
                          </th>
                          <th className="p-2 text-left font-medium">
                            <T>Gain hebdo (1–12)</T>
                          </th>
                          <th className="p-2 text-left font-medium">
                            <T>Semaine 13</T>
                          </th>
                          <th className="p-2 text-left font-medium">
                            <T>Total final</T>
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {weeklyRows.map((row, i) => (
                          <tr
                            key={i}
                            className="border-t border-sbc-border/30 hover:bg-sbc-bgSoft/40 transition"
                          >
                            <td className="p-2 text-sbc-text font-semibold">
                              {formatXOF(row.amount)}
                            </td>
                            <td className="p-2">
                              {formatXOF(row.baseWeekly)} <T>/ semaine</T>
                            </td>
                            <td className="p-2 text-sbc-gold">
                              {formatXOF(row.lastWeek)}
                            </td>
                            <td className="p-2 text-sbc-gold font-semibold">
                              {formatXOF(row.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-sm md:text-base font-semibold text-sbc-gold">
                    <T>Projection des gains journaliers</T>
                  </h3>

                  <div className="overflow-x-auto rounded-2xl border border-sbc-border/70 bg-sbc-bgSoft/30 max-w-full sm:max-w-xl">
                    <table className="w-full min-w-[360px] text-[10px] sm:text-[11px] md:text-xs text-sbc-muted border-collapse">
                      <thead>
                        <tr className="bg-sbc-bgSoft/70 text-sbc-gold">
                          <th className="p-2 text-left font-medium">
                            <T>Palier investi</T>
                          </th>
                          <th className="p-2 text-left font-medium">
                            <T>Gain journalier estimé</T>
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {dailyRows.map((row, i) => (
                          <tr
                            key={i}
                            className="border-t border-sbc-border/40 hover:bg-sbc-bgSoft/40 transition"
                          >
                            <td className="p-2 text-sbc-text">
                              {formatXOF(row.amount)}
                            </td>
                            <td className="p-2 text-sbc-gold">
                              {formatXOF(row.dailyGain)} <T>/ jour</T>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-sbc-bgSoft/30 border border-sbc-border/70 rounded-2xl p-3 md:p-4 text-[10px] sm:text-[11px] text-sbc-muted leading-relaxed">
                  <T>
                    Ces projections se basent sur un modèle simple : chaque
                    palier double en 90 jours, soit un rendement théorique de{" "}
                  </T>
                  <span className="text-sbc-gold">
                    <T>100 %</T>
                  </span>
                  <T>
                    . Les montants hebdomadaires et journaliers sont obtenus en
                    répartissant ce montant final (capital + gains) sur 13
                    semaines ou 90 jours. Ils ont pour but d&apos;offrir une
                    vision pédagogique de la progression potentielle et ne
                    constituent pas une garantie de performance. Smart Business
                    Corp applique une stratégie centrée sur la protection du
                    capital et une sélection prudente des opportunités
                    d&apos;investissement.
                  </T>
                </div>
              </>
            );
          })()}
        </section>

        {/* SECTION CTA FINALE */}
        <section className="bg-sbc-bgSoft/50 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.85)] flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm md:text-base font-semibold">
              <T>Prêt à structurer votre façon d&apos;investir ?</T>
            </p>
            <p className="text-xs md:text-sm text-sbc-muted max-w-xl">
              <T>
                Créez votre compte, choisissez votre palier et commencez à
                suivre l&apos;évolution de votre capital au sein d&apos;une
                stratégie encadrée.
              </T>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              onClick={() =>
                trackEvent("click_register", { context: "home_cta" })
              }
              className="px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs md:text-sm font-semibold hover:bg-sbc-goldSoft hover:text-sbc-bg transition"
            >
              <T>Commencer maintenant</T>
            </Link>

            <Link
              href="/qui-sommes-nous"
              onClick={() => trackEvent("click_team", { context: "home_cta" })}
              className="px-4 py-2 rounded-full border border-sbc-border text-sbc-muted text-xs md:text-sm hover:bg-sbc-bgSoft transition"
            >
              <T>En savoir plus sur l&apos;équipe</T>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
