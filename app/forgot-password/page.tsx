"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeSenegalPhone } from "@/src/utils/phone";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function ForgotPasswordPhonePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    const normalized = normalizeSenegalPhone(phone);

    try {
      const res = await fetch(`${API_URL}/api/password-reset/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "Erreur lors de la vérification du numéro de téléphone."
        );
      }

      // On stocke le phone normalisé dans l’URL pour l’étape suivante
      router.push(
        `/forgot-password/security?phone=${encodeURIComponent(normalized)}`
      );
    } catch (err: any) {
      setErrorMessage(
        err?.message ||
          "Erreur lors de la vérification du numéro de téléphone."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-6 shadow">
        <p className="uppercase text-[11px] tracking-[0.25em] text-sbc-gold">
          Mot de passe oublié
        </p>
        <h1 className="text-2xl font-semibold mt-2 mb-2">
          Réinitialiser votre mot de passe
        </h1>
        <p className="text-xs md:text-sm text-sbc-muted leading-relaxed">
          Entrez votre numéro de téléphone utilisé lors de l&apos;inscription.
          Si un compte existe, vous devrez ensuite répondre à votre question de
          sécurité.
        </p>
      </section>

      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-6 shadow">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {errorMessage && (
            <div className="text-xs text-red-400 bg-red-950/30 border border-red-700/40 rounded-2xl px-3 py-2">
              {errorMessage}
            </div>
          )}
          {infoMessage && (
            <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-700/40 rounded-2xl px-3 py-2">
              {infoMessage}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[11px] md:text-xs text-sbc-muted">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              required
              placeholder="+221 77 000 00 00"
              value={phone}
              onChange={(e) => setPhone(normalizeSenegalPhone(e.target.value))}
              className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-sm text-sbc-text"
            />
            <p className="text-[10px] text-sbc-muted mt-1">
              Nous n&apos;acceptons pour le moment que les numéros au format
              +221XXXXXXXXX.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg font-semibold disabled:opacity-50"
          >
            {loading ? "Vérification..." : "Suivant"}
          </button>
        </form>
      </section>
    </div>
  );
}
