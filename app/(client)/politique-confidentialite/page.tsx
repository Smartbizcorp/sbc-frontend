// app/(client)/politique-confidentialite/page.tsx
import Link from "next/link";

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* HEADER */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-sbc-gold">
            Informations légales
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold mt-1">
            Politique de confidentialité
          </h1>
          <p className="text-xs md:text-sm text-sbc-muted max-w-xl mt-2 leading-relaxed">
            Cette page présente la manière dont Smart Business Corp collecte,
            utilise et protège vos données personnelles dans le cadre de
            l&apos;utilisation de sa plateforme d&apos;investissement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bgSoft text-[11px] md:text-xs font-semibold hover:bg-transparent hover:text-sbc-gold transition"
          >
            Retour au dashboard
          </Link>
        </div>
      </section>

      {/* CONTENU POLITIQUE DE CONFIDENTIALITÉ */}
      <section className="bg-sbc-bgSoft/70 border border-sbc-border rounded-3xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-xs md:text-sm text-sbc-muted leading-relaxed space-y-5">
        <p className="text-[11px] md:text-xs text-sbc-muted/80 italic">
                  </p>

        <div className="space-y-2">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            1. Responsable du traitement
          </h2>
          <p>
            Le responsable du traitement des données personnelles est Smart
            Business Corp (ci-après « nous » ou « Smart Business Corp »), qui
            exploite la plateforme d&apos;investissement accessible depuis
            l&apos;espace client. Pour toute question relative à vos données
            personnelles, vous pouvez nous contacter via les canaux habituels
            (formulaire de contact, assistance, e-mail indiqué sur le site).
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            2. Données personnelles collectées
          </h2>
          <p>
            Dans le cadre de la création et de la gestion de votre compte, nous
            pouvons être amenés à collecter les catégories de données suivantes :
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Informations d&apos;identification : nom, prénom, numéro de téléphone, e-mail.</li>
            <li>Informations liées au compte client : identifiant interne, historique de connexion.</li>
            <li>
              Données financières liées à l&apos;utilisation de la plateforme :
              montants investis, retraits demandés, gains cumulés, historique
              des opérations.
            </li>
            <li>
              Données techniques et de navigation : adresse IP, type de
              navigateur, pages consultées, horodatages, lorsque cela est
              nécessaire au bon fonctionnement de la plateforme et à sa
              sécurité.
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            3. Finalités du traitement
          </h2>
          <p>Vos données personnelles sont traitées pour les finalités suivantes :</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Création, gestion et sécurisation de votre compte client.</li>
            <li>
              Suivi de vos investissements, calcul des performances,
              affichage des soldes, gains et retraits.
            </li>
            <li>
              Traitement de vos demandes (retraits, assistance, réclamations).
            </li>
            <li>
              Envoi de notifications relatives à la vie de votre compte
              (confirmations d&apos;opérations, alertes importantes,
              informations de sécurité).
            </li>
            <li>
              Amélioration continue de la plateforme, statistiques d&apos;usage
              et prévention de la fraude ou des comportements abusifs.
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            4. Bases légales
          </h2>
          <p>
            Selon la réglementation applicable, le traitement de vos données
            peut reposer notamment sur :
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              l&apos;exécution d&apos;un contrat : gestion de votre compte client
              et des opérations d&apos;investissement ;
            </li>
            <li>
              le respect d&apos;obligations légales et réglementaires, notamment
              en matière de lutte contre la fraude et de conformité ;
            </li>
            <li>
              l&apos;intérêt légitime de Smart Business Corp à sécuriser sa
              plateforme et améliorer ses services ;
            </li>
            <li>
              votre consentement, lorsque celui-ci est requis (par exemple pour
              certaines communications marketing ou certains cookies).
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            5. Durée de conservation
          </h2>
          <p>
            Vos données sont conservées pendant la durée nécessaire à la
            gestion de la relation contractuelle, augmentée des délais de
            prescription éventuellement applicables. Certaines données peuvent
            être conservées plus longtemps pour répondre à des obligations
            légales, comptables ou réglementaires, puis archivées ou
            anonymisées.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            6. Destinataires des données
          </h2>
          <p>
            Les données collectées sont destinées à Smart Business Corp et, le
            cas échéant, à ses prestataires techniques agissant pour son compte
            (hébergement, services de paiement, outils de messagerie,
            maintenance). Ces prestataires sont soumis à des obligations de
            confidentialité et ne peuvent utiliser vos données que dans le
            cadre strict des services qui leur sont confiés.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            7. Transferts hors du pays / hors de l&apos;Union européenne
          </h2>
          <p>
            Lorsque cela est nécessaire à la fourniture des services (par
            exemple utilisation d&apos;un prestataire d&apos;hébergement ou
            d&apos;envoi d&apos;e-mails basé à l&apos;étranger), des
            transferts de données hors du pays de résidence ou hors de
            l&apos;Union européenne peuvent avoir lieu. Dans ce cas, Smart
            Business Corp veille à ce que ces transferts soient encadrés par
            des garanties appropriées (contrats, clauses de protection des
            données, mécanismes reconnus par la réglementation applicable).
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            8. Sécurité des données
          </h2>
          <p>
            Smart Business Corp met en œuvre des mesures techniques et
            organisationnelles raisonnables pour protéger vos données contre
            toute perte, accès non autorisé, divulgation ou altération
            (contrôles d&apos;accès, chiffrement de certaines données,
            journalisation, restrictions internes d&apos;accès, etc.).
            Toutefois, aucun système n&apos;étant parfaitement sécurisé, nous
            vous invitons également à adopter de bonnes pratiques (mot de
            passe robuste, non-partage de vos identifiants, vigilance face aux
            tentatives de phishing).
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            9. Vos droits
          </h2>
          <p>
            Conformément à la réglementation applicable en matière de
            protection des données personnelles, vous disposez notamment des
            droits suivants (selon votre situation et votre pays de résidence) :
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Droit d&apos;accès à vos données personnelles ;</li>
            <li>Droit de rectification des données inexactes ou incomplètes ;</li>
            <li>Droit d&apos;effacement dans certains cas ;</li>
            <li>
              Droit de limitation ou d&apos;opposition à certains traitements ;
            </li>
            <li>
              Droit à la portabilité, lorsque cela est techniquement possible ;
            </li>
            <li>
              Droit de retirer votre consentement à tout moment, lorsque le
              traitement est fondé sur celui-ci.
            </li>
          </ul>
          <p className="mt-2">
            Pour exercer ces droits, vous pouvez contacter notre service
            d&apos;assistance via l&apos;espace client ou par tout moyen de
            contact indiqué dans la rubrique Assistance. Une réponse vous sera
            apportée dans les meilleurs délais, conformément au cadre légal
            applicable.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            10. Cookies et traceurs
          </h2>
          <p>
            La plateforme Smart Business Corp peut utiliser des cookies ou
            technologies similaires afin d&apos;assurer son bon
            fonctionnement, mesurer l&apos;audience et améliorer
            l&apos;expérience utilisateur. Lorsque la réglementation
            l&apos;impose, certains cookies non strictement nécessaires ne
            sont déposés qu&apos;avec votre consentement. Des informations
            plus détaillées sur les cookies utilisés et les modalités de
            paramétrage pourront être précisées dans une bannière ou une
            rubrique dédiée.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm md:text-base font-semibold text-sbc-gold">
            11. Mise à jour de la politique
          </h2>
          <p>
            La présente politique de confidentialité peut être mise à jour pour
            refléter les évolutions légales, réglementaires ou fonctionnelles
            de la plateforme. En cas de modification importante, une
            information pourra être affichée dans votre espace client ou via
            les canaux habituels de communication. Nous vous invitons à
            consulter régulièrement cette page pour rester informé(e) de la
            manière dont vos données sont protégées.
          </p>
        </div>
      </section>
    </div>
  );
}
