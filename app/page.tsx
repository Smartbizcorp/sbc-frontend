import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 sm:gap-10 lg:gap-14">
      {/* HERO */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-lg flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-center">
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sbc-gold">
            Plateforme d&apos;investissement
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
            Faites travailler votre capital avec{" "}
            <span className="text-sbc-gold">Smart Business Corp</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-sbc-muted leading-relaxed max-w-xl">
            Une approche structurée de l&apos;investissement par paliers, encadrée
            par une équipe de traders expérimentés. Suivi transparent, gestion du
            risque disciplinée et retraits organisés deux fois par semaine.
          </p>

          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              href="/register"
              className="px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs md:text-sm font-semibold hover:bg-sbc-goldSoft hover:text-sbc-bg transition"
            >
              Créer un compte
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-full border border-sbc-border text-sbc-muted text-xs md:text-sm hover:bg-sbc-bgSoft transition"
            >
              Accéder à mon espace
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] text-sbc-muted">
            <div>
              <p className="text-sbc-gold font-semibold text-sm">
                Paliers clairs
              </p>
              <p>De 10 000 à 500 000 XOF.</p>
            </div>
            <div>
              <p className="text-sbc-gold font-semibold text-sm">
                Stratégie encadrée
              </p>
              <p>Gestion du risque avancée.</p>
            </div>
            <div>
              <p className="text-sbc-gold font-semibold text-sm">
                Retraits 2x / semaine
              </p>
              <p>Fenêtres organisées.</p>
            </div>
          </div>
        </div>

        {/* Bloc latéral "Info rapide" */}
        <div className="flex-1 w-full">
          <div className="bg-sbc-bg/80 border border-sbc-border rounded-3xl p-4 sm:p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-4 text-xs md:text-sm">
            <p className="text-sbc-gold font-semibold text-sm">
              Investir par paliers, suivre avec sérénité
            </p>
            <p className="text-sbc-muted leading-relaxed">
              Choisissez votre palier, suivez l&apos;évolution de votre capital,
              effectuez vos retraits dans des fenêtres dédiées : la mécanique est
              claire, la stratégie est encadrée.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-sbc-muted">
              <div className="border border-sbc-border rounded-2xl p-3">
                <p className="text-sbc-gold font-semibold mb-1">Paliers</p>
                <p>10 000 · 25 000 · 50 000 XOF</p>
                <p>100 000 · 250 000 · 500 000 XOF</p>
              </div>
              <div className="border border-sbc-border rounded-2xl p-3">
                <p className="text-sbc-gold font-semibold mb-1">Horizon</p>
                <p>Stratégie conçue sur 90 jours</p>
                <p>Réévaluée en continu.</p>
              </div>
            </div>
            <p className="text-[10px] text-sbc-muted mt-1">
              Important : l&apos;investissement comporte un risque de perte en capital. 
              Notre stratégie vise à{" "}
              <span className="text-sbc-gold font-semibold">
                éviter scrupuleusement la perte du capital
              </span>{" "}
              mais ne peut supprimer totalement le risque.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION "Pourquoi Smart Business Corp ?" */}
      <section className="flex flex-col gap-4 sm:gap-5">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-sbc-gold">
          Pourquoi choisir Smart Business Corp ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 text-xs md:text-sm">
          <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-4 md:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
            <p className="font-semibold text-sbc-gold mb-1">
              Approche structurée
            </p>
            <p className="text-sbc-muted leading-relaxed">
              Paliers définis, horizon temporel clair, stratégie pensée pour
              éviter la confusion et les décisions impulsives.
            </p>
          </div>
          <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-4 md:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
            <p className="font-semibold text-sbc-gold mb-1">
              Gestion du risque
            </p>
            <p className="text-sbc-muted leading-relaxed">
              Exposition maîtrisée, scénarios prudents, ajustements progressifs
              plutôt que paris agressifs.
            </p>
          </div>
          <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-4 md:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.7)]">
            <p className="font-semibold text-sbc-gold mb-1">
              Suivi transparent
            </p>
            <p className="text-sbc-muted leading-relaxed">
              Accès permanent à l&apos;évolution de votre portefeuille, retraits encadrés
              et informations claires sur votre situation.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION TABLEAUX GAINS HEBDO + JOURNALIER */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.9)] backdrop-blur-lg flex flex-col gap-5 sm:gap-6">
        <div>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sbc-gold mb-2">
            Projection premium
          </p>

          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
            Gains estimés par palier
          </h2>

          <p className="text-[10px] sm:text-[11px] md:text-xs text-sbc-muted leading-relaxed max-w-2xl">
            Modèle basé sur un doublement du capital sur une période de 90 jours.
            Les montants ci-dessous répartissent ce résultat final, d&apos;abord
            par semaine, puis par jour, pour offrir une vision pédagogique de la
            progression potentielle.
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
            const baseWeekly = Math.floor(total / totalWeeks); // semaines 1 → 12
            const lastWeek = total - baseWeekly * (totalWeeks - 1); // semaine 13 ajustée

            return {
              amount,
              baseWeekly,
              lastWeek,
              total,
            };
          });

          const dailyRows = tiers.map((amount) => {
            const total = amount * 2;
            const dailyGain = Math.round(total / totalDays);
            return {
              amount,
              dailyGain,
            };
          });

          return (
            <>
              {/* TABLEAU PREMIUM - GAINS HEBDOMADAIRES PAR PALIER */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm md:text-base font-semibold text-sbc-gold">
                  Gains hebdomadaires estimés (total final arrondi)
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-sbc-border/50 bg-sbc-bgSoft/40">
                  <table className="w-full min-w-[480px] text-[10px] sm:text-[11px] md:text-xs text-sbc-muted border-collapse">
                    <thead>
                      <tr className="bg-sbc-bgSoft/70 text-sbc-gold">
                        <th className="p-2 text-left font-medium">Palier</th>
                        <th className="p-2 text-left font-medium">Gain hebdo (1–12)</th>
                        <th className="p-2 text-left font-medium">Semaine 13</th>
                        <th className="p-2 text-left font-medium">Total final</th>
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
                            {formatXOF(row.baseWeekly)} / semaine
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

              {/* PETIT TABLEAU JOURNALIER */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm md:text-base font-semibold text-sbc-gold">
                  Projection des gains journaliers
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-sbc-border/70 bg-sbc-bgSoft/30 max-w-full sm:max-w-xl">
                  <table className="w-full min-w-[360px] text-[10px] sm:text-[11px] md:text-xs text-sbc-muted border-collapse">
                    <thead>
                      <tr className="bg-sbc-bgSoft/70 text-sbc-gold">
                        <th className="p-2 text-left font-medium">
                          Palier investi
                        </th>
                        <th className="p-2 text-left font-medium">
                          Gain journalier estimé
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
                            {formatXOF(row.dailyGain)} / jour
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* COMMENTAIRE EXPLICATIF */}
              <div className="bg-sbc-bgSoft/30 border border-sbc-border/70 rounded-2xl p-3 md:p-4 text-[10px] sm:text-[11px] text-sbc-muted leading-relaxed">
                Ces projections se basent sur un modèle simple&nbsp;: chaque palier
                double en 90 jours, soit un rendement théorique de{" "}
                <span className="text-sbc-gold">100&nbsp;%</span>. Les montants
                hebdomadaires et journaliers sont obtenus en répartissant ce montant
                final (capital + gains) sur 13 semaines ou 90 jours. Ils ont pour but
                d&apos;offrir une vision pédagogique de la progression potentielle
                et ne constituent pas une garantie de performance. Smart Business
                Corp applique une stratégie centrée sur la protection du capital et
                une sélection prudente des opportunités d&apos;investissement.
              </div>
            </>
          );
        })()}
      </section>

      {/* SECTION CTA FINALE */}
      <section className="bg-sbc-bgSoft/50 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.85)] flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm md:text-base font-semibold">
            Prêt à structurer votre façon d&apos;investir ?
          </p>
          <p className="text-xs md:text-sm text-sbc-muted max-w-xl">
            Créez votre compte, choisissez votre palier et commencez à suivre
            l&apos;évolution de votre capital au sein d&apos;une stratégie encadrée.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs md:text-sm font-semibold hover:bg-sbc-goldSoft hover:text-sbc-bg transition"
          >
            Commencer maintenant
          </Link>
          <Link
            href="/qui-sommes-nous"
            className="px-4 py-2 rounded-full border border-sbc-border text-sbc-muted text-xs md:text-sm hover:bg-sbc-bgSoft transition"
          >
            En savoir plus sur l&apos;équipe
          </Link>
        </div>
      </section>
    </div>
  );
}
