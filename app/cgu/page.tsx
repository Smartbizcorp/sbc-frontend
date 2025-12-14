// frontend/app/cgu/page.tsx
import Link from "next/link";

const CGU_VERSION = "v1.0";
const EFFECTIVE_DATE = "13/12/2025"; // change si besoin

const CGU_PDF_PATH = "/cgu/CGU_Smart_Business_Corp_v1.0.pdf"; // public/cgu/...

const CGU_CONTENT = `CONDITIONS GÉNÉRALES D’UTILISATION
SMART BUSINESS CORP
Version : ${CGU_VERSION} – Entrée en vigueur : ${EFFECTIVE_DATE}

1. Objet
Les présentes Conditions Générales d’Utilisation (CGU) ont pour objet de définir les modalités d’accès et d’utilisation de la plateforme Smart Business Corp, accessible via application web et interfaces numériques associées.
Toute inscription et utilisation de la plateforme implique l’acceptation pleine, entière et sans réserve des présentes CGU.

2. Accès à la plateforme
L’accès à la plateforme est strictement réservé aux personnes juridiquement capables.
L’utilisateur s’engage à fournir des informations exactes, complètes et à jour.
Smart Business Corp se réserve le droit de refuser, suspendre ou résilier l’accès à tout utilisateur ne respectant pas ces obligations.

3. Nature du service
Smart Business Corp met à disposition un service de participation à des opérations financières structurées, fondées sur des stratégies internes de trading et de gestion du risque.
Smart Business Corp n’est pas un établissement bancaire et ne fournit aucun conseil financier personnalisé.

4. Risques liés à l’investissement
L’utilisateur reconnaît expressément que tout investissement comporte des risques, y compris un risque de perte partielle du capital investi.
Dans le cadre de sa stratégie de maîtrise du risque, Smart Business Corp met en œuvre des mécanismes visant à limiter l’exposition maximale aux pertes, laquelle est plafonnée à cinquante pour cent (50 %) du capital investi par l’utilisateur.
L’utilisateur reconnaît et accepte l’existence d’un scénario exceptionnel dit “scénario catastrophe”, dans lequel, malgré les mesures mises en place, une perte pouvant atteindre jusqu’à 50 % du capital investi pourrait survenir à l’issue de la période d’investissement.

5. Durée de l’investissement et hypothèse de performance
Chaque opération d’investissement s’inscrit dans une durée contractuelle ferme de quatre-vingt-dix (90) jours.
Dans le scénario de performance prévu, et sous réserve des conditions de marché, cette opération peut permettre à l’utilisateur d’atteindre un montant équivalent à jusqu’au double (x2) du capital initialement investi.
Cette projection ne constitue ni une garantie de rendement, ni une promesse contractuelle, mais une hypothèse fondée sur des données historiques et des stratégies internes.

6. Sortie anticipée
Toute demande de retrait ou de cessation de l’investissement avant l’échéance contractuelle de 90 jours entraîne l’acceptation expresse par l’utilisateur des conditions suivantes :
- remboursement limité à cinquante pour cent (50 %) du capital initialement investi,
- auquel s’ajoutent, le cas échéant, les intérêts effectivement générés jusqu’à la date de la demande.

7. Dépôts et retraits
Les modalités de dépôts et de retraits sont précisées sur la plateforme.
Les délais de traitement peuvent varier selon les contraintes techniques, opérationnelles ou imputables à des prestataires tiers.

8. Sécurité et responsabilité de l’utilisateur
L’utilisateur est seul responsable de la confidentialité de ses identifiants.
Toute action effectuée depuis un compte est réputée réalisée par son titulaire.

9. Limitation de responsabilité
Smart Business Corp ne saurait être tenue responsable des pertes ou dommages résultant notamment :
- de fluctuations extrêmes des marchés,
- de crises économiques, financières ou monétaires,
- de décisions réglementaires ou administratives,
- de cas de force majeure au sens du droit sénégalais et des Actes uniformes OHADA,
- de défaillances de prestataires tiers.
La responsabilité globale de Smart Business Corp est strictement limitée, toutes causes confondues, aux montants effectivement investis par l’utilisateur, dans la limite définie à l’article relatif aux risques.

10. Données personnelles
Les données personnelles sont traitées conformément à la réglementation applicable.
L’utilisateur dispose d’un droit d’accès, de rectification et de suppression de ses données.

11. Règlement amiable préalable
Tout différend relatif à l’utilisation de la plateforme ou à l’exécution des présentes CGU devra faire l’objet, avant toute action judiciaire, d’une tentative de règlement amiable.

12. Actions abusives
Toute action judiciaire manifestement abusive, infondée ou dilatoire pourra donner lieu à une demande de dommages-intérêts, conformément au droit applicable.

13. Modification des CGU
Smart Business Corp se réserve le droit de modifier les présentes CGU à tout moment.
Toute modification substantielle donnera lieu à une nouvelle acceptation obligatoire par l’utilisateur.

14. Droit applicable et juridiction
Les présentes CGU sont régies par le droit sénégalais, conformément aux Actes uniformes de l’OHADA.
À défaut de règlement amiable, tout litige relève de la compétence des juridictions compétentes.

15. Acceptation
En cochant la case « J’accepte les Conditions Générales d’Utilisation », l’utilisateur reconnaît avoir pris connaissance des présentes CGU et les accepter sans réserve.
`;

export default function CguPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-0 py-6 sm:py-8">
      {/* Header */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.85)]">
        <p className="uppercase text-[10px] sm:text-[11px] tracking-[0.25em] text-sbc-gold">
          Légal
        </p>

        <h1 className="text-2xl sm:text-3xl md:text-[32px] font-semibold mt-2 leading-snug">
          Conditions Générales d’Utilisation
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-sbc-muted leading-relaxed">
          Version <span className="text-sbc-text">{CGU_VERSION}</span> — Entrée
          en vigueur : <span className="text-sbc-text">{EFFECTIVE_DATE}</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={CGU_PDF_PATH}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs sm:text-sm font-semibold hover:bg-sbc-goldSoft transition"
          >
            Télécharger PDF
          </a>

          <Link
            href="/register"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-sbc-border text-xs sm:text-sm text-sbc-text hover:border-sbc-gold hover:text-sbc-gold transition"
          >
            Aller à l’inscription
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="mt-5 sm:mt-6 bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        <pre className="whitespace-pre-wrap text-[11px] sm:text-xs text-sbc-muted leading-relaxed">
          {CGU_CONTENT}
        </pre>

        <div className="mt-6 flex items-center justify-between">
          <a
            href="#top"
            className="text-[11px] sm:text-xs text-sbc-muted underline hover:text-sbc-gold"
          >
            Revenir en haut
          </a>

          <Link
            href="/"
            className="text-[11px] sm:text-xs text-sbc-muted underline hover:text-sbc-gold"
          >
            Retour accueil
          </Link>
        </div>
      </section>

      {/* Invisible anchor */}
      <div id="top" className="sr-only" />
    </div>
  );
}
