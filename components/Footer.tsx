import Link from "next/link";
import Image from "next/image";
import { T } from "@/components/T";
import { useTr } from "@/lib/useTr";

export function Footer() {
  const { tr } = useTr();

  return (
    <footer className="mt-10 border-t border-sbc-border bg-sbc-bg/90 backdrop-blur">
      <div
        className="
          w-full
          max-w-5xl
          mx-auto
          px-3
          sm:px-4
          md:px-6
          lg:px-10
          py-6
          sm:py-8
          md:py-10
          flex
          flex-col
          gap-6
          sm:gap-8
        "
      >
        {/* Top */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex flex-col sm:flex-row sm:items-center md:items-start gap-3 text-center sm:text-left">
            <div className="relative h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-2xl border border-sbc-gold/60 bg-sbc-bgSoft shadow-[0_0_30px_rgba(0,0,0,0.7)] overflow-hidden mx-auto sm:mx-0">
              <Image
                src="/logo-smart-business-corp.png"
                alt="Smart Business Corp"
                fill
                className="object-contain p-1.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-semibold text-sbc-gold">
                Smart Business Corp
              </span>
              <span className="text-[10px] sm:text-[11px] text-sbc-muted">
                <T>Plateforme d'investissement encadrée</T>
              </span>
            </div>
          </div>

          {/* Liens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px] md:text-xs">
            <div className="flex flex-col gap-1.5">
              <p className="text-sbc-muted uppercase tracking-[0.18em] text-[10px]">
                <T>Navigation</T>
              </p>

              <Link href="/" className="text-sbc-muted hover:text-sbc-gold">
                <T>Accueil</T>
              </Link>

              <Link href="/qui-sommes-nous" className="text-sbc-muted hover:text-sbc-gold">
                <T>Qui sommes-nous</T>
              </Link>

              <Link href="/faq" className="text-sbc-muted hover:text-sbc-gold">
                <T>FAQ &amp; Risques</T>
              </Link>

              <Link href="/login" className="text-sbc-muted hover:text-sbc-gold">
                <T>Espace client</T>
              </Link>

              <Link href="/cgu" className="text-sbc-muted hover:text-sbc-gold">
                <T>CGU</T>
              </Link>

              <Link href="/confidentialite" className="text-sbc-muted hover:text-sbc-gold">
                <T>Politique de confidentialité</T>
              </Link>

              <Link href="/mentions-legales" className="text-sbc-muted hover:text-sbc-gold">
                <T>Mentions légales</T>
              </Link>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-sbc-muted uppercase tracking-[0.18em] text-[10px]">
                <T>Contact</T>
              </p>

              <p className="text-sbc-muted">
                {tr("Support WhatsApp :")}{" "}
                <span className="text-sbc-gold">+221 XX XXX XX XX</span>
              </p>

              <p className="text-sbc-muted">
                {tr("Email :")}{" "}
                <span className="text-sbc-gold">support@smartbusinesscorp.com</span>
              </p>

              <p className="text-sbc-muted">
                {tr("Moyen de paiement :")} <span className="text-sbc-gold">Wave</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div
          className="
            flex
            flex-col
            md:flex-row
            items-start
            md:items-center
            justify-between
            gap-2
            border-t
            border-sbc-border
            pt-4
            text-[10px]
            text-sbc-muted
            text-center
            md:text-left
          "
        >
          <p>
            © {new Date().getFullYear()} Smart Business Corp.{" "}
            <T>Tous droits réservés.</T>
          </p>

          <div className="flex flex-col md:items-end gap-1">
            <p>
              <T>
                L'investissement comporte un risque de perte en capital. Investissez de manière responsable.
              </T>
            </p>

            <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center md:justify-end">
              <Link href="/cgu" className="underline hover:text-sbc-gold">
                <T>CGU</T>
              </Link>
              <Link href="/confidentialite" className="underline hover:text-sbc-gold">
                <T>Confidentialité</T>
              </Link>
              <Link href="/mentions-legales" className="underline hover:text-sbc-gold">
                <T>Mentions légales</T>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
