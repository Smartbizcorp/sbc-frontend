"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function PaiementChoixPage({
  params,
}: {
  params: { id: string }; // ⚠️ ici id = montant, pas l'ID d'investissement
}) {
  const amountXOF = Number(params.id || "0");

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingWave, setLoadingWave] = useState(false);
  const [createdInvestmentId, setCreatedInvestmentId] = useState<number | null>(
    null
  );

  const handleWaveClick = async () => {
    if (!amountXOF || Number.isNaN(amountXOF)) {
      setError(
        "Montant invalide. Merci de revenir à l'écran précédent et de choisir un palier."
      );
      return;
    }

    // on évite le double-clic
    if (loadingWave || createdInvestmentId) return;

    setLoadingWave(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/investments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important pour envoyer le cookie sbc_token
        body: JSON.stringify({ amountXOF }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Impossible de créer l'investissement."
        );
      }

      const investment = data.investment;
      setCreatedInvestmentId(investment.id);

      setMessage(
        `Votre demande d'investissement de ${amountXOF.toLocaleString(
          "fr-FR"
        )} XOF a été enregistrée (ID #${investment.id}, statut PENDING).`
      );

      // 👉 on ouvre ensuite la page de paiement Wave
      window.open(
        "https://pay.wave.com/m/M_sn_5pLfEghRDWoV/c/sn/",
        "_blank",
        "noopener,noreferrer"
      );
    } catch (err: any) {
      setError(
        err?.message ||
          "Erreur lors de la création de l'investissement. Veuillez réessayer."
      );
    } finally {
      setLoadingWave(false);
    }
  };

  const handleOrangeClick = () => {
    setMessage("Service Orange Money indisponible pour le moment.");
  };

  return (
    <div className="min-h-screen bg-sbc-bg flex items-center justify-center px-3 sm:px-4 py-8 sm:py-10">
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-3xl bg-sbc-bgSoft/70 border border-sbc-border shadow-[0_18px_50px_rgba(0,0,0,0.85)] p-5 sm:p-7 md:p-8 space-y-5 sm:space-y-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-sbc-gold text-center leading-snug">
          Choisissez votre moyen de paiement
        </h1>

        <p className="text-xs sm:text-sm text-sbc-muted text-center">
          Montant sélectionné :{" "}
          <span className="font-semibold text-sbc-gold">
            {amountXOF.toLocaleString("fr-FR")} XOF
          </span>
          . Sélectionnez un mode de paiement pour enregistrer votre demande.
        </p>

        {createdInvestmentId && (
          <p className="text-[11px] sm:text-xs text-center text-sbc-muted">
            Demande enregistrée avec l&apos;ID{" "}
            <span className="font-semibold text-sbc-gold">
              #{createdInvestmentId}
            </span>{" "}
            (statut PENDING).
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-2 sm:mt-4">
          {/* Bouton Wave */}
          <button
            onClick={handleWaveClick}
            disabled={loadingWave || !!createdInvestmentId}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-sbc-border bg-sbc-bg px-4 sm:px-6 py-4 hover:border-sbc-gold hover:shadow-[0_0_25px_rgba(212,158,58,0.55)] disabled:opacity-60 disabled:cursor-not-allowed transition text-center"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
              <Image
                src="/logos/wave.png"
                alt="Payer avec Wave"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm sm:text-base font-semibold text-sbc-text group-hover:text-sbc-gold">
              {loadingWave
                ? "Création de la demande..."
                : "Payer avec Wave"}
            </span>
          </button>

          {/* Bouton Orange Money */}
          <button
            onClick={handleOrangeClick}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-sbc-border bg-sbc-bg px-4 sm:px-6 py-4 hover:border-red-500/70 hover:shadow-[0_0_25px_rgba(239,68,68,0.55)] transition text-center"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
              <Image
                src="/logos/orange-money.png"
                alt="Payer avec Orange Money"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm sm:text-base font-semibold text-sbc-text group-hover:text-red-400">
              Payer avec Orange Money
            </span>
          </button>
        </div>

        {error && (
          <p className="mt-3 text-center text-xs sm:text-sm text-red-400">
            {error}
          </p>
        )}

        {message && !error && (
          <p className="mt-3 text-center text-xs sm:text-sm text-sbc-muted">
            {message}
          </p>
        )}

        <div className="pt-3 sm:pt-4 flex justify-center">
          <Link
            href="/dashboard"
            className="text-[11px] sm:text-xs text-sbc-muted hover:text-sbc-gold transition"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
