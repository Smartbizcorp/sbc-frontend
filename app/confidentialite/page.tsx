// frontend/app/confidentialite/page.tsx
import Link from "next/link";

const PRIVACY_VERSION = "v1.0";
const EFFECTIVE_DATE = "01/11/2025";

const PRIVACY_PDF_PATH = "/legal/Politique_Confidentialite_SBC_v1.0.pdf"; // optionnel (public/legal/...)

const PRIVACY_CONTENT = `POLITIQUE DE CONFIDENTIALITÉ
SMART BUSINESS CORP
Version : ${PRIVACY_VERSION} – Entrée en vigueur : ${EFFECTIVE_DATE}

1. Objet
La présente politique de confidentialité explique comment Smart Business Corp collecte, utilise, conserve et protège les données personnelles des utilisateurs de la plateforme.

2. Données collectées
Selon l’usage de la plateforme, nous pouvons collecter :
- Identité : nom complet
- Contact : numéro de téléphone, email (optionnel)
- Données de compte : identifiants techniques de session, journaux de connexion
- Données de paiement : numéro Wave (à des fins de traitement)
- Données de sécurité : question de sécurité et empreinte (hash) de la réponse
- Données d’acceptation légale : date d’acceptation des CGU, version, adresse IP (si disponible), user-agent (si disponible)

3. Finalités du traitement
Les données sont utilisées pour :
- créer et gérer le compte utilisateur
- sécuriser l’accès (prévention fraude / abus)
- traiter les opérations (dépôts, retraits, suivi)
- assurer le support client
- respecter les obligations légales et/ou réglementaires

4. Base légale
Le traitement repose notamment sur :
- l’exécution du contrat (fourniture du service)
- le consentement lorsque requis
- l’intérêt légitime (sécurité, prévention fraude)
- le respect d’obligations légales

5. Conservation
Les données sont conservées pendant la durée nécessaire aux finalités décrites et/ou selon les exigences légales. Certaines données techniques (logs) peuvent être conservées pour des raisons de sécurité.

6. Partage avec des tiers
Nous pouvons partager certaines données avec :
- prestataires techniques (hébergement, monitoring)
- prestataires de communication (email/SMS/WhatsApp si activés)
- prestataires de paiement (ex : Wave) dans la mesure nécessaire à l’exécution du service
Nous ne vendons pas vos données.

7. Sécurité
Nous appliquons des mesures techniques et organisationnelles visant à protéger les données :
- hash des éléments sensibles (ex : réponse de sécurité)
- contrôle d’accès, journalisation, limitation de requêtes
- chiffrement en transit (HTTPS) quand disponible

8. Droits des utilisateurs
Sous réserve de la réglementation applicable, l’utilisateur peut demander :
- accès, rectification, suppression
- limitation ou opposition dans certains cas
Les demandes peuvent être adressées au support.

9. Cookies
La plateforme peut utiliser des cookies techniques nécessaires au fonctionnement (ex : cookie de session). Aucun cookie publicitaire n’est requis pour l’utilisation de base.

10. Modifications
Cette politique peut être mise à jour. La version en vigueur est celle publiée sur la plateforme.

Contact
Pour toute demande : support@smartbusinesscorp.com
`;

export default function ConfidentialitePage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-0 py-6 sm:py-8">
      {/* Header */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.85)]">
        <p className="uppercase text-[10px] sm:text-[11px] tracking-[0.25em] text-sbc-gold">
          Légal
        </p>

        <h1 className="text-2xl sm:text-3xl md:text-[32px] font-semibold mt-2 leading-snug">
          Politique de confidentialité
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-sbc-muted leading-relaxed">
          Version <span className="text-sbc-text">{PRIVACY_VERSION}</span> —
          Entrée en vigueur :{" "}
          <span className="text-sbc-text">{EFFECTIVE_DATE}</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={PRIVACY_PDF_PATH}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-sbc-border text-xs sm:text-sm text-sbc-text hover:border-sbc-gold hover:text-sbc-gold transition"
          >
            Télécharger PDF (optionnel)
          </a>

          <Link
            href="/cgu"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs sm:text-sm font-semibold hover:bg-sbc-goldSoft transition"
          >
            Voir CGU
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="mt-5 sm:mt-6 bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        <pre className="whitespace-pre-wrap text-[11px] sm:text-xs text-sbc-muted leading-relaxed">
          {PRIVACY_CONTENT}
        </pre>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-[11px] sm:text-xs text-sbc-muted underline hover:text-sbc-gold"
          >
            Retour accueil
          </Link>

          <Link
            href="/mentions-legales"
            className="text-[11px] sm:text-xs text-sbc-muted underline hover:text-sbc-gold"
          >
            Mentions légales
          </Link>
        </div>
      </section>
    </div>
  );
}
