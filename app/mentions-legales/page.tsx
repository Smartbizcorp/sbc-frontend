// frontend/app/mentions-legales/page.tsx
import Link from "next/link";
import { T } from "@/components/T";

const LEGAL_VERSION = "v1.0";
const EFFECTIVE_DATE = "01/11/2025";

const LEGAL_CONTENT = `MENTIONS LÉGALES
SMART BUSINESS CORP
Version : ${LEGAL_VERSION} – Mise à jour : ${EFFECTIVE_DATE}

1. Éditeur du site
Smart Business Corp
[Forme juridique] : [à compléter]
[Numéro d’immatriculation / registre] : [à compléter]
[Adresse] : [à compléter]
Email : support@smartbusinesscorp.com

2. Hébergement
[Hébergeur] : [à compléter]
[Adresse hébergeur] : [à compléter]

3. Propriété intellectuelle
L’ensemble des éléments du site (textes, visuels, logos, marques, codes, etc.) est protégé.
Toute reproduction, diffusion ou utilisation non autorisée est interdite.

4. Avertissement – Risques
L’investissement comporte un risque de perte en capital. Les informations publiées sur la plateforme ne constituent pas un conseil financier personnalisé.

5. Responsabilité
Smart Business Corp s’efforce d’assurer l’exactitude des informations, sans garantie absolue. La responsabilité ne saurait être engagée pour des interruptions, erreurs, ou dommages indirects.

6. Contact
Pour toute question : support@smartbusinesscorp.com
`;

export default function MentionsLegalesPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-0 py-6 sm:py-8">
      {/* HEADER */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 shadow-[0_18px_45px_rgba(0,0,0,0.85)]">
        <p className="uppercase text-[10px] sm:text-[11px] tracking-[0.25em] text-sbc-gold">
          <T>Légal</T>
        </p>

        <h1 className="text-2xl sm:text-3xl md:text-[32px] font-semibold mt-2 leading-snug">
          <T>Mentions légales</T>
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-sbc-muted leading-relaxed">
          <T>Version</T>{" "}
          <span className="text-sbc-text">{LEGAL_VERSION}</span>{" "}
          <T>— Mise à jour :</T>{" "}
          <span className="text-sbc-text">{EFFECTIVE_DATE}</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/cgu"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs sm:text-sm font-semibold hover:bg-sbc-goldSoft transition"
          >
            <T>Voir les CGU</T>
          </Link>

          <Link
            href="/confidentialite"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-sbc-border text-xs sm:text-sm text-sbc-text hover:border-sbc-gold hover:text-sbc-gold transition"
          >
            <T>Politique de confidentialité</T>
          </Link>
        </div>
      </section>

      {/* CONTENU */}
      <section className="mt-5 sm:mt-6 bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        <pre className="whitespace-pre-wrap text-[11px] sm:text-xs text-sbc-muted leading-relaxed">
          <T>{LEGAL_CONTENT}</T>
        </pre>

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-[11px] sm:text-xs text-sbc-muted underline hover:text-sbc-gold"
          >
            <T>Retour à l’accueil</T>
          </Link>

          <Link
            href="/confidentialite"
            className="text-[11px] sm:text-xs text-sbc-muted underline hover:text-sbc-gold"
          >
            <T>Politique de confidentialité</T>
          </Link>
        </div>
      </section>
    </div>
  );
}
