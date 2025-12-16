// app/(client)/politique-confidentialite/page.tsx
"use client";

import Link from "next/link";
import { T } from "@/components/T";

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="w-full min-h-[calc(100vh-120px)] px-4 sm:px-6 py-6 sm:py-8">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 md:gap-10">
        {/* HEADER */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-sbc-gold">
              <T>Informations légales</T>
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">
              <T>Politique de confidentialité</T>
            </h1>
            <p className="text-xs md:text-sm text-sbc-muted max-w-xl mt-2 leading-relaxed">
              <T>
                Cette page présente la manière dont Smart Business Corp collecte,
                utilise et protège vos données personnelles dans le cadre de
                l&apos;utilisation de sa plateforme d&apos;investissement.
              </T>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bgSoft text-[11px] md:text-xs font-semibold hover:bg-transparent hover:text-sbc-gold transition"
            >
              <T>Retour au dashboard</T>
            </Link>
          </div>
        </section>

        {/* CONTENU POLITIQUE DE CONFIDENTIALITÉ */}
        <section className="bg-sbc-bgSoft/70 border border-sbc-border rounded-3xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-xs md:text-sm text-sbc-muted leading-relaxed space-y-5">
          <p className="text-[11px] md:text-xs text-sbc-muted/80 italic">
            {/* <T>Dernière mise à jour : ...</T> */}
          </p>

          <div className="space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
              <T>1. Responsable du traitement</T>
            </h2>
            <p>
              <T>
                Le responsable du traitement des données personnelles est Smart
                Business Corp (ci-après « nous » ou « Smart Business Corp »), qui
                exploite la plateforme d&apos;investissement accessible depuis
                l&apos;espace client. Pour toute question relative à vos données
                personnelles, vous pouvez nous contacter via les canaux habituels
                (formulaire de contact, assistance, e-mail indiqué sur le site).
              </T>
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
              <T>2. Données personnelles collectées</T>
            </h2>
            <p>
              <T>
                Dans le cadre de la création et de la gestion de votre compte, nous
                pouvons être amenés à collecter les catégories de données suivantes :
              </T>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <T>
                  Informations d&apos;identification : nom, prénom, numéro de
                  téléphone, e-mail.
                </T>
              </li>
              <li>
                <T>
                  Informations liées au compte client : identifiant interne,
                  historique de connexion.
                </T>
              </li>
              <li>
                <T>
                  Données financières liées à l&apos;utilisation de la plateforme :
                  montants investis, retraits demandés, gains cumulés, historique
                  des opérations.
                </T>
              </li>
              <li>
                <T>
                  Données techniques et de navigation : adresse IP, type de
                  navigateur, pages consultées, horodatages, lorsque cela est
                  nécessaire au bon fonctionnement de la plateforme et à sa
                  sécurité.
                </T>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
              <T>3. Finalités du traitement</T>
            </h2>
            <p>
              <T>Vos données personnelles sont traitées pour les finalités suivantes :</T>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <T>Création, gestion et sécurisation de votre compte client.</T>
              </li>
              <li>
                <T>
                  Suivi de vos investissements, calcul des performances, affichage
                  des soldes, gains et retraits.
                </T>
              </li>
              <li>
                <T>Traitement de vos demandes (retraits, assistance, réclamations).</T>
              </li>
              <li>
                <T>
                  Envoi de notifications relatives à la vie de votre compte
                  (confirmations d&apos;opérations, alertes importantes,
                  informations de sécurité).
                </T>
              </li>
              <li>
                <T>
                  Amélioration continue de la plateforme, statistiques d&apos;usage
                  et prévention de la fraude ou des comportements abusifs.
                </T>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
              <T>4. Bases légales</T>
            </h2>
            <p>
              <T>
                Selon la réglementation applicable, le traitement de vos données peut
                reposer notamment sur :
              </T>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <T>
                  l&apos;exécution d&apos;un contrat : gestion de votre compte client
                  et des opérations d&apos;investissement ;
                </T>
              </li>
              <li>
                <T>
                  le respect d&apos;obligations légales et réglementaires, notamment
                  en matière de lutte contre la fraude et de conformité ;
                </T>
              </li>
              <li>
                <T>
                  l&apos;intérêt légitime de Smart Business Corp à sécuriser sa
                  plateforme et améliorer ses services ;
                </T>
              </li>
              <li>
                <T>
                  votre consentement, lorsque celui-ci est requis (par exemple pour
                  certaines communications marketing ou certains cookies).
                </T>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
              <T>5. Durée de conservation</T>
            </h2>
            <p>
              <T>
                Vos données sont conservées pendant la durée nécessaire à la gestion
                de la relation contractuelle, augmentée des délais de prescription
                éventuellement applicables. Certaines données peuvent être conservées
                plus longtemps pour répondre à des obligations légales, comptables ou
                réglementaires, puis archivées ou anonymisées.
              </T>
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
              <T>6. Destinataires des données</T>
            </h2>
            <p>
              <T>
                Les données collectées sont destinées à Smart Business Corp et, le cas
                échéant, à ses prestataires techniques agissant pour son compte
                (hébergement, services de paiement, outils de messagerie, maintenance).
                Ces prestataires sont soumis à des obligations de confidentialité et ne
                peuvent utiliser vos données que dans le cadre strict des services qui
                leur sont confiés.
              </T>
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
              <T>7. Transferts hors du pays / hors de l&apos;Union européenne</T>
            </h2>
            <p>
              <T>
                Lorsque cela est nécessaire à la fourniture des services (par exemple
                utilisation d&apos;un prestataire d&apos;hébergement ou d&apos;envoi
                d&apos;e-mails basé à l&apos;étranger), des transferts de données hors
                du pays de résidence ou hors de l&apos;Union européenne peuvent avoir
                lieu. Dans ce cas, Smart Business Corp veille à ce que ces transferts
                soient encadrés par des garanties appropriées (contrats, clauses de
                protection des données, mécanismes reconnus par la réglementation
                applicable).
              </T>
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
              <T>8. Sécurité des données</T>
            </h2>
            <p>
              <T>
                Smart Business Corp met en œuvre des mesures techniques et
                organisationnelles raisonnables pour protéger vos données contre toute
                perte, accès non autorisé, divulgation ou altération (contrôles
                d&apos;accès, chiffrement de certaines données, journalisation,
                restrictions internes d&apos;accès, etc.). Toutefois, aucun système
                n&apos;étant parfaitement sécurisé, nous vous invitons également à
                adopter de bonnes pratiques (mot de passe robuste, non-partage de vos
                identifiants, vigilance face aux tentatives de phishing).
              </T>
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
              <T>9. Vos droits</T>
            </h2>
            <p>
              <T>
                Conformément à la réglementation applicable en matière de protection
                des données personnelles, vous disposez notamment des droits suivants
                (selon votre situation et votre pays de résidence) :
              </T>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <T>Droit d&apos;accès à vos données personnelles ;</T>
              </li>
              <li>
                <T>Droit de rectification des données inexactes ou incomplètes ;</T>
              </li>
              <li>
                <T>Droit d&apos;effacement dans certains cas ;</T>
              </li>
              <li>
                <T>Droit de limitation ou d&apos;opposition à certains traitements ;</T>
              </li>
              <li>
                <T>Droit à la portabilité, lorsque cela est techniquement possible ;</T>
              </li>
              <li>
                <T>
                  Droit de retirer votre consentement à tout moment, lorsque le
                  traitement est fondé sur celui-ci.
                </T>
              </li>
            </ul>
            <p className="mt-2">
              <T>
                Pour exercer ces droits, vous pouvez contacter notre service
                d&apos;assistance via l&apos;espace client ou par tout moyen de
                contact indiqué dans la rubrique Assistance. Une réponse vous sera
                apportée dans les meilleurs délais, conformément au cadre légal
                applicable.
              </T>
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
              <T>10. Cookies et traceurs</T>
            </h2>
            <p>
              <T>
                La plateforme Smart Business Corp peut utiliser des cookies ou
                technologies similaires afin d&apos;assurer son bon fonctionnement,
                mesurer l&apos;audience et améliorer l&apos;expérience utilisateur.
                Lorsque la réglementation l&apos;impose, certains cookies non
                strictement nécessaires ne sont déposés qu&apos;avec votre
                consentement. Des informations plus détaillées sur les cookies utilisés
                et les modalités de paramétrage pourront être précisées dans une
                bannière ou une rubrique dédiée.
              </T>
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
              <T>11. Mise à jour de la politique</T>
            </h2>
            <p>
              <T>
                La présente politique de confidentialité peut être mise à jour pour
                refléter les évolutions légales, réglementaires ou fonctionnelles de la
                plateforme. En cas de modification importante, une information pourra
                être affichée dans votre espace client ou via les canaux habituels de
                communication. Nous vous invitons à consulter régulièrement cette page
                pour rester informé(e) de la manière dont vos données sont protégées.
              </T>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
