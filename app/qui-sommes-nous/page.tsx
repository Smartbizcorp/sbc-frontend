import Image from "next/image";

export default function QuiSommesNousPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 md:gap-12">
      {/* HERO / INTRO */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-6 md:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-lg flex flex-col md:flex-row gap-6 md:gap-8 md:items-center">
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-[11px] uppercase tracking-[0.25em] text-sbc-gold">
            Qui sommes-nous
          </p>
          <h1 className="text-2xl md:text-4xl font-semibold leading-snug">
            Une équipe de{" "}
            <span className="text-sbc-gold">jeunes traders expérimentés</span>{" "}
            au service d&apos;une vision structurée de l&apos;investissement.
          </h1>
          <p className="text-xs md:text-sm text-sbc-muted leading-relaxed">
            Smart Business Corp est née de la rencontre de plusieurs profils
            passionnés par les marchés financiers, la gestion du risque et la
            technologie. Nous combinons l&apos;agilité d&apos;une jeune équipe
            avec plus de 10 ans d&apos;expérience cumulée pour bâtir une
            plateforme d&apos;investissement encadrée, lisible et accessible.
          </p>
        </div>

        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative h-28 w-28 md:h-40 md:w-40 rounded-full border border-sbc-gold/70 bg-sbc-bg shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden">
            <Image
              src="/logo-smart-business-corp.png"
              alt="Smart Business Corp"
              fill
              className="object-contain p-5"
            />
          </div>
        </div>
      </section>

      {/* SECTION EXPÉRIENCE & ADN */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <div className="bg-sbc-bgSoft/40 backdrop-blur-xl border border-sbc-border rounded-3xl p-5 md:p-6 shadow-[0_15px_45px_rgba(0,0,0,0.7)]">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold mb-2">
            Une expérience forgée sur les marchés
          </h2>
          <p className="text-xs md:text-sm text-sbc-muted leading-relaxed">
            L&apos;équipe Smart Business Corp est composée de traders actifs
            ayant étudié et pratiqué les marchés : devises, indices, matières
            premières, produits dérivés. Au fil des années, nous avons affiné
            nos méthodes, stressé nos stratégies dans différents contextes de
            marché et mis au point une approche disciplinée de la gestion du
            capital.
          </p>
        </div>

        <div className="bg-sbc-bgSoft/40 backdrop-blur-xl border border-sbc-border rounded-3xl p-5 md:p-6 shadow-[0_15px_45px_rgba(0,0,0,0.7)]">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold mb-2">
            Une vision claire de l&apos;investissement
          </h2>
          <p className="text-xs md:text-sm text-sbc-muted leading-relaxed">
            Nous croyons en une approche d&apos;investissement structurée :
            paliers définis, horizon temporel clair, fenêtres de retrait
            encadrées et suivi régulier des performances. L&apos;objectif :
            permettre à chaque investisseur de comprendre où il en est, ce
            qu&apos;il vise et comment son capital évolue.
          </p>
        </div>
      </section>

      {/* SECTION APPROCHE / STRATÉGIE */}
      <section className="bg-sbc-bgSoft/50 backdrop-blur-xl border border-sbc-border rounded-3xl p-6 md:p-8 shadow-[0_20px_55px_rgba(0,0,0,0.85)] flex flex-col gap-5">
        <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
          Notre approche de l&apos;investissement
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 text-xs md:text-sm">
          <div className="bg-sbc-bg/80 rounded-2xl border border-sbc-border p-4 flex flex-col gap-2">
            <p className="font-semibold text-sbc-gold">Analyse &amp; discipline</p>
            <p className="text-sbc-muted leading-relaxed">
              Analyse des tendances, observation des comportements de prix et
              application stricte de règles d&apos;entrée et de sortie. Nos
              décisions ne reposent pas sur l&apos;intuition mais sur des
              scénarios construits.
            </p>
          </div>

          <div className="bg-sbc-bg/80 rounded-2xl border border-sbc-border p-4 flex flex-col gap-2">
            <p className="font-semibold text-sbc-gold">Gestion du risque</p>
            <p className="text-sbc-muted leading-relaxed">
              Notre stratégie repose sur{" "}
              <span className="text-sbc-gold font-semibold">
                un évitement scrupuleux de toute perte du capital
              </span>{" "}
              : limitation de l&apos;exposition, diversification des scénarios,
              ajustements progressifs plutôt que paris agressifs.
            </p>
          </div>

          <div className="bg-sbc-bg/80 rounded-2xl border border-sbc-border p-4 flex flex-col gap-2">
            <p className="font-semibold text-sbc-gold">Suivi structuré</p>
            <p className="text-sbc-muted leading-relaxed">
              Vision globale des paliers, performances agrégées, retraits
              encadrés et communication claire. L&apos;investisseur voit
              l&apos;essentiel : capital, évolution et prochaines étapes.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION VALEURS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-5 text-xs md:text-sm shadow-[0_12px_35px_rgba(0,0,0,0.7)]">
          <p className="font-semibold text-sbc-gold mb-1">Transparence</p>
          <p className="text-sbc-muted leading-relaxed">
            Pas de promesses irréalistes, pas de chiffres gonflés. Nous
            présentons des objectifs, des scénarios et rappelons
            systématiquement le risque.
          </p>
        </div>

        <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-5 text-xs md:text-sm shadow-[0_12px_35px_rgba(0,0,0,0.7)]">
          <p className="font-semibold text-sbc-gold mb-1">Responsabilité</p>
          <p className="text-sbc-muted leading-relaxed">
            Nous encourageons nos investisseurs à rester prudents, à diversifier
            leurs revenus et à n&apos;investir que des montants qu&apos;ils
            peuvent se permettre d&apos;immobiliser.
          </p>
        </div>

        <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-5 text-xs md:text-sm shadow-[0_12px_35px_rgba(0,0,0,0.7)]">
          <p className="font-semibold text-sbc-gold mb-1">Exigence</p>
          <p className="text-sbc-muted leading-relaxed">
            Amélioration continue des stratégies, backtests, remise en question
            permanente des modèles. Ce qui fonctionne aujourd&apos;hui est
            régulièrement revu pour demain.
          </p>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-4 md:p-5 text-[11px] md:text-xs text-sbc-muted leading-relaxed">
        <p>
          Même avec une équipe expérimentée et une stratégie orientée vers la
          protection du capital, tout investissement comporte un risque de
          perte. Smart Business Corp encourage chaque investisseur à agir avec
          prudence et à s&apos;informer avant toute décision.
        </p>
      </section>
    </div>
  );
}
