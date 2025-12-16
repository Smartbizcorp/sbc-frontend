import Link from "next/link";
import { T } from "@/components/T";

export default function FAQPage() {
  return (
    <main className="w-full min-h-screen px-4 sm:px-6 py-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8 md:gap-12">
        {/* HEADER FAQ */}
        <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-lg flex flex-col gap-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sbc-gold">
            <T>FAQ</T>
          </p>

          <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold leading-snug">
            <T>Questions fréquentes &amp; </T>
            <span className="text-sbc-gold">
              <T>gestion du risque</T>
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed max-w-3xl">
            <T>
              Retrouvez les réponses aux questions les plus courantes ainsi que
              les principes essentiels de gestion du risque appliqués par Smart
              Business Corp.
            </T>
          </p>

          {/* Bouton poser une question */}
          <div className="mt-2">
            <Link
              href="/faq/question"
              className="inline-flex items-center px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs sm:text-sm font-semibold hover:bg-sbc-goldSoft hover:text-sbc-bg transition"
            >
              <T>Posez votre question</T>
            </Link>
          </div>
        </section>

        {/* 1. Fonctionnement SBC */}
        <section className="flex flex-col gap-4 md:gap-6">
          <h2 className="text-sm sm:text-base md:text-xl font-semibold text-sbc-gold">
            <T>1. Comprendre le fonctionnement de Smart Business Corp</T>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <div className="bg-sbc-bgSoft/40 backdrop-blur-xl border border-sbc-border rounded-3xl p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <h3 className="text-xs sm:text-sm font-semibold text-sbc-gold mb-2">
                <T>Qu’est-ce que Smart Business Corp ?</T>
              </h3>
              <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
                <T>
                  Smart Business Corp est une structure d’investissement gérée par
                  une équipe expérimentée cumulant plus de 10 ans sur les marchés
                  financiers.
                </T>
              </p>
            </div>

            <div className="bg-sbc-bgSoft/40 backdrop-blur-xl border border-sbc-border rounded-3xl p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <h3 className="text-xs sm:text-sm font-semibold text-sbc-gold mb-2">
                <T>Comment fonctionnent les investissements par paliers ?</T>
              </h3>
              <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
                <T>
                  Des paliers de 10 000 à 500 000 XOF, structurés sur 90 jours,
                  avec suivi automatisé des performances.
                </T>
              </p>
            </div>
          </div>
        </section>

        {/* 2. Dépôts & retraits */}
        <section className="flex flex-col gap-4 md:gap-6">
          <h2 className="text-sm sm:text-base md:text-xl font-semibold text-sbc-gold">
            <T>2. Dépôts, retraits &amp; gestion du compte</T>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <div className="bg-sbc-bgSoft/40 backdrop-blur-xl border border-sbc-border rounded-3xl p-4 sm:p-5">
              <h3 className="text-xs sm:text-sm font-semibold text-sbc-gold mb-2">
                <T>À quelle fréquence puis-je retirer ?</T>
              </h3>
              <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
                <T>
                  Jusqu’à deux fois par semaine pour garantir la stabilité du
                  portefeuille collectif.
                </T>
              </p>
            </div>

            <div className="bg-sbc-bgSoft/40 backdrop-blur-xl border border-sbc-border rounded-3xl p-4 sm:p-5">
              <h3 className="text-xs sm:text-sm font-semibold text-sbc-gold mb-2">
                <T>Quels moyens de paiement sont disponibles ?</T>
              </h3>
              <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
                <T>Pour le moment : Wave.</T>
              </p>
            </div>
          </div>
        </section>

        {/* 3. Risques */}
        <section className="flex flex-col gap-4 md:gap-6">
          <h2 className="text-sm sm:text-base md:text-xl font-semibold text-sbc-gold">
            <T>3. Comprendre les risques</T>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <div className="bg-sbc-bgSoft/40 backdrop-blur-xl border border-sbc-border rounded-3xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
              <h3 className="text-xs sm:text-sm font-semibold text-sbc-gold mb-2">
                <T>Y a-t-il un risque de perte ?</T>
              </h3>
              <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
                <T>Oui. Comme tout investissement, il comporte un risque.</T>{" "}
                <span className="text-sbc-gold font-semibold">
                  <T>Notre stratégie vise l’évitement maximal des pertes du capital.</T>
                </span>{" "}
                <T>
                  Cependant, aucun modèle ne peut éliminer entièrement les
                  imprévus du marché.
                </T>
              </p>
            </div>

            <div className="bg-sbc-bgSoft/40 backdrop-blur-xl border border-sbc-border rounded-3xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
              <h3 className="text-xs sm:text-sm font-semibold text-sbc-gold mb-2">
                <T>Comment protégez-vous les investissements ?</T>
              </h3>
              <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
                <T>
                  Diversification, limites d’exposition, gestion manuelle +
                  algorithmique, et suivi en continu des conditions de marché.
                </T>
              </p>
            </div>
          </div>
        </section>

        {/* 4. Transparence */}
        <section className="flex flex-col gap-4 md:gap-6 mb-4">
          <h2 className="text-sm sm:text-base md:text-xl font-semibold text-sbc-gold">
            <T>4. Transparence &amp; conformité</T>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <div className="bg-sbc-bgSoft/40 backdrop-blur-xl border border-sbc-border rounded-3xl p-4 sm:p-5">
              <h3 className="text-xs sm:text-sm font-semibold text-sbc-gold mb-2">
                <T>Y a-t-il des frais cachés ?</T>
              </h3>
              <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
                <T>Aucun frais caché. Tout est clairement indiqué.</T>
              </p>
            </div>

            <div className="bg-sbc-bgSoft/40 backdrop-blur-xl border border-sbc-border rounded-3xl p-4 sm:p-5">
              <h3 className="text-xs sm:text-sm font-semibold text-sbc-gold mb-2">
                <T>Êtes-vous une banque ?</T>
              </h3>
              <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
                <T>
                  Non, Smart Business Corp n’est pas une banque mais une structure
                  d’investissement privée.
                </T>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
