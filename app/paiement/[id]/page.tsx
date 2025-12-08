"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PaiementChoixPage({
  params,
}: {
  params: { id: string };
}) {
  const investmentId = params.id;
  const [message, setMessage] = useState<string | null>(null);

  const handleWaveClick = () => {
    // Ouvre la page de paiement Wave dans un nouvel onglet
    window.open(
      "https://pay.wave.com/m/M_sn_5pLfEghRDWoV/c/sn/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleOrangeClick = () => {
    setMessage("Service indisponible pour le moment.");
  };

  return (
    <div className="min-h-screen bg-sbc-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl bg-sbc-bgSoft/70 border border-sbc-border shadow-[0_18px_50px_rgba(0,0,0,0.85)] p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-sbc-gold text-center">
          Choisissez votre moyen de paiement
        </h1>

        <p className="text-sm text-sbc-muted text-center">
          Investissement ID #{investmentId}. Sélectionnez un mode de paiement
          pour finaliser votre demande.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {/* Bouton Wave */}
          <button
            onClick={handleWaveClick}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-sbc-border bg-sbc-bg px-6 py-4 hover:border-sbc-gold hover:shadow-[0_0_25px_rgba(212,158,58,0.55)] transition"
          >
            <div className="relative w-28 h-28">
              <Image
                src="/logos/wave.png" // mets ici le bon chemin de ton logo Wave
                alt="Payer avec Wave"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-sbc-text group-hover:text-sbc-gold">
              Payer avec Wave
            </span>
          </button>

          {/* Bouton Orange Money */}
          <button
            onClick={handleOrangeClick}
            className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-sbc-border bg-sbc-bg px-6 py-4 hover:border-red-500/70 hover:shadow-[0_0_25px_rgba(239,68,68,0.55)] transition"
          >
            <div className="relative w-28 h-28">
              <Image
                src="/logos/orange-money.png" // mets ici le bon chemin de ton logo Orange Money
                alt="Payer avec Orange Money"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-sbc-text group-hover:text-red-400">
              Payer avec Orange Money
            </span>
          </button>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-red-400">{message}</p>
        )}

        <div className="pt-4 flex justify-center">
          <Link
            href="/dashboard"
            className="text-xs text-sbc-muted hover:text-sbc-gold transition"
          >
            Retour au dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
