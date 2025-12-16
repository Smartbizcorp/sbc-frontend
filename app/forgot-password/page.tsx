"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeSenegalPhone } from "@/src/utils/phone";
import { T, useTr } from "@/components/T";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function ForgotPasswordPhonePage() {
  const router = useRouter();
  const { tr } = useTr();

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
          data.message || "Erreur lors de la vérification du numéro de téléphone."
        );
      }

      router.push(
        `/forgot-password/security?phone=${encodeURIComponent(normalized)}`
      );
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Erreur lors de la vérification du numéro de téléphone."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-md mx-auto flex flex-col gap-6">
        {/* HEADER */}
        <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <p className="uppercase text-[10px] sm:text-[11px] tracking-[0.25em] text-sbc-gold">
            <T>Mot de passe oublié</T>
          </p>
          <h1 className="text-xl sm:text-2xl font-semibold mt-2 mb-2">
            <T>Réinitialiser votre mot de passe</T>
          </h1>
          <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
            <T>
              Entrez votre numéro de téléphone utilisé lors de l&apos;inscription.
              Si un compte existe, vous devrez ensuite répondre à votre question
              de sécurité.
            </T>
          </p>
        </section>

        {/* FORMULAIRE */}
        <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMessage && (
              <div className="text-[11px] sm:text-xs text-red-400 bg-red-950/30 border border-red-700/40 rounded-2xl px-3 py-2">
                <T>{errorMessage}</T>
              </div>
            )}

            {infoMessage && (
              <div className="text-[11px] sm:text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-700/40 rounded-2xl px-3 py-2">
                <T>{infoMessage}</T>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[11px] sm:text-xs text-sbc-muted">
                <T>Numéro de téléphone</T>
              </label>

              <input
                type="tel"
                required
                placeholder={tr("+221 77 000 00 00")}
                aria-label={tr("Numéro de téléphone")}
                value={phone}
                onChange={(e) => setPhone(normalizeSenegalPhone(e.target.value))}
                className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-sm text-sbc-text focus:outline-none focus:ring-1 focus:ring-sbc-gold focus:border-sbc-gold"
              />

              <p className="text-[10px] text-sbc-muted mt-1">
                <T>
                  Nous n&apos;acceptons pour le moment que les numéros au format
                  +221XXXXXXXXX.
                </T>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg font-semibold text-xs sm:text-sm hover:bg-sbc-goldSoft transition disabled:opacity-50"
              aria-label={tr(loading ? "Vérification..." : "Suivant")}
            >
              <T>{loading ? "Vérification..." : "Suivant"}</T>
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
