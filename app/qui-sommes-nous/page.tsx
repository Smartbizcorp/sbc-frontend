import Image from "next/image";
import { T } from "@/components/T";

export default function QuiSommesNousPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-0 flex flex-col gap-6 sm:gap-8 md:gap-12">
      {/* HERO / INTRO */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-lg flex flex-col md:flex-row gap-5 sm:gap-6 md:gap-8 md:items-center">
        <div className="flex-1 flex flex-col gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sbc-gold">
            <T>Qui sommes-nous</T>
          </p>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug">
            <T>Une équipe de </T>
            <span className="text-sbc-gold">
              <T>jeunes traders expérimentés</T>
            </span>{" "}
            <T>
              au service d&apos;une vision structurée de l&apos;investissement.
            </T>
          </h1>

          <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
            <T>
              Smart Business Corp est née de la rencontre de plusieurs profils
              passionnés par les marchés financiers, la gestion du risque et la
              technologie. Nous combinons l&apos;agilité d&apos;une jeune équipe
              avec plus de 10 ans d&apos;expérience cumulée pour bâtir une
              plateforme d&apos;investissement encadrée, lisible et accessible.
            </T>
          </p>
        </div>

        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-40 md:w-40 rounded-full border border-sbc-gold/70 bg-sbc-bg shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
            <Image
              src="/logo-smart-business-corp.png"
              alt="Smart Business Corp"
              fill
              className="object-contain p-4 sm:p-5"
              priority
            />
          </div>
        </div>
      </section>

      {/* SECTION EXPÉRIENCE & ADN */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        <div className="bg-sbc-bgSoft/40 backdrop-blur-xl border border-sbc-border rounded-3xl p-4 sm:p-5 md:p-6 shadow-[0_15px_45px_rgba(0,0,0,0.7)]">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold mb-2">
            <T>Une expérience forgée sur les marchés</T>
          </h2>
          <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
            <T>
              L&apos;équipe Smart Business Corp est composée de traders actifs
              ayant étudié et pratiqué les marchés : devises, indices, matières
              premières, produits dérivés. Au fil des années, nous avons affiné
              nos méthodes, stressé nos stratégies dans différents contextes de
              marché et mis au point une approche disciplinée de la gestion du
              capital.
            </T>
          </p>
        </div>

        <div className="bg-sbc-bgSoft/40 backdrop-blur-xl border border-sbc-border rounded-3xl p-4 sm:p-5 md:p-6 shadow-[0_15px_45px_rgba(0,0,0,0.7)]">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold mb-2">
            <T>Une vision claire de l&apos;investissement</T>
          </h2>
          <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
            <T>
              Nous croyons en une approche d&apos;investissement structurée :
              paliers définis, horizon temporel clair, fenêtres de retrait
              encadrées et suivi régulier des performances. L&apos;objectif :
              permettre à chaque investisseur de comprendre où il en est, ce
              qu&apos;il vise et comment son capital évolue.
            </T>
          </p>
        </div>
      </section>

      {/* SECTION APPROCHE / STRATÉGIE */}
      <section className="bg-sbc-bgSoft/50 backdrop-blur-xl border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_20px_55px_rgba(0,0,0,0.85)] flex flex-col gap-4 sm:gap-5">
        <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
          <T>Notre approche de l&apos;investissement</T>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 text-xs sm:text-sm">
          <div className="bg-sbc-bg/80 rounded-2xl border border-sbc-border p-4 flex flex-col gap-2">
            <p className="font-semibold text-sbc-gold">
              <T>Analyse &amp; discipline</T>
            </p>
            <p className="text-sbc-muted leading-relaxed">
              <T>
                Analyse des tendances, observation des comportements de prix et
                application stricte de règles d&apos;entrée et de sortie. Nos
                décisions ne reposent pas sur l&apos;intuition mais sur des
                scénarios construits.
              </T>
            </p>
          </div>

          <div className="bg-sbc-bg/80 rounded-2xl border border-sbc-border p-4 flex flex-col gap-2">
            <p className="font-semibold text-sbc-gold">
              <T>Gestion du risque</T>
            </p>
            <p className="text-sbc-muted leading-relaxed">
              <T>Notre stratégie repose sur </T>
              <span className="text-sbc-gold font-semibold">
                <T>un évitement scrupuleux de toute perte du capital</T>
              </span>{" "}
              <T>
                : limitation de l&apos;exposition, diversification des scénarios,
                ajustements progressifs plutôt que paris agressifs.
              </T>
            </p>
          </div>

          <div className="bg-sbc-bg/80 rounded-2xl border border-sbc-border p-4 flex flex-col gap-2">
            <p className="font-semibold text-sbc-gold">
              <T>Suivi structuré</T>
            </p>
            <p className="text-sbc-muted leading-relaxed">
              <T>
                Vision globale des paliers, performances agrégées, retraits
                encadrés et communication claire. L&apos;investisseur voit
                l&apos;essentiel : capital, évolution et prochaines étapes.
              </T>
            </p>
          </div>
        </div>
      </section>

      {/* SECTION VALEURS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-4 md:gap-5">
        <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-4 sm:p-5 text-xs sm:text-sm shadow-[0_12px_35px_rgba(0,0,0,0.7)]">
          <p className="font-semibold text-sbc-gold mb-1">
            <T>Transparence</T>
          </p>
          <p className="text-sbc-muted leading-relaxed">
            <T>
              Pas de promesses irréalistes, pas de chiffres gonflés. Nous
              présentons des objectifs, des scénarios et rappelons
              systématiquement le risque.
            </T>
          </p>
        </div>

        <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-4 sm:p-5 text-xs sm:text-sm shadow-[0_12px_35px_rgba(0,0,0,0.7)]">
          <p className="font-semibold text-sbc-gold mb-1">
            <T>Responsabilité</T>
          </p>
          <p className="text-sbc-muted leading-relaxed">
            <T>
              Nous encourageons nos investisseurs à rester prudents, à diversifier
              leurs revenus et à n&apos;investir que des montants qu&apos;ils
              peuvent se permettre d&apos;immobiliser.
            </T>
          </p>
        </div>

        <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-4 sm:p-5 text-xs sm:text-sm shadow-[0_12px_35px_rgba(0,0,0,0.7)]">
          <p className="font-semibold text-sbc-gold mb-1">
            <T>Exigence</T>
          </p>
          <p className="text-sbc-muted leading-relaxed">
            <T>
              Amélioration continue des stratégies, backtests, remise en question
              permanente des modèles. Ce qui fonctionne aujourd&apos;hui est
              régulièrement revu pour demain.
            </T>
          </p>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-4 sm:p-4 md:p-5 text-[10px] sm:text-[11px] md:text-xs text-sbc-muted leading-relaxed">
        <p>
          <T>
            Même avec une équipe expérimentée et une stratégie orientée vers la
            protection du capital, tout investissement comporte un risque de
            perte. Smart Business Corp encourage chaque investisseur à agir avec
            prudence et à s&apos;informer avant toute décision.
          </T>
        </p>
      </section>
    </div>
  );
}
