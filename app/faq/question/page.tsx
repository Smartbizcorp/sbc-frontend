"use client";

import { useState } from "react";
import { T } from "@/components/T";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function QuestionFAQPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/faq-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, phone, email, question }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erreur lors de l'envoi.");
      }

      setSuccess(
        "Votre question a été envoyée avec succès. Nous vous répondrons par email ou WhatsApp."
      );
      setName("");
      setPhone("");
      setEmail("");
      setQuestion("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen px-4 sm:px-6 py-8">
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 sm:gap-8 md:gap-10">
        {/* HEADER / CONTEXTE */}
        <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_20px_55px_rgba(0,0,0,0.85)] backdrop-blur-lg flex flex-col gap-3">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sbc-gold">
            <T>FAQ • Question</T>
          </p>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">
            <T>Posez votre question à l&apos;équipe Smart Business Corp</T>
          </h1>

          <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
            <T>
              Utilisez ce formulaire pour nous poser une question précise sur le
              fonctionnement, les retraits, les paliers ou la gestion du risque.
              Nous reviendrons vers vous dès que possible avec une réponse claire.
            </T>
          </p>
        </section>

        {/* FORMULAIRE */}
        <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col gap-4">
          {success && (
            <div className="text-[11px] sm:text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-700/50 rounded-2xl px-3 py-2">
              {success}
            </div>
          )}

          {error && (
            <div className="text-[11px] sm:text-xs text-red-400 bg-red-950/30 border border-red-700/50 rounded-2xl px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Identité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] sm:text-xs text-sbc-muted">
                  <T>Nom complet</T> <span className="text-sbc-gold">*</span>
                </label>
                <input
                  className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs sm:text-sm text-sbc-text outline-none focus:border-sbc-gold"
                  placeholder="Ex : Jean Dupont"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-label="Nom complet"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] sm:text-xs text-sbc-muted">
                  <T>Numéro de téléphone (WhatsApp)</T>{" "}
                  <span className="text-sbc-gold">*</span>
                </label>
                <input
                  className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs sm:text-sm text-sbc-text outline-none focus:border-sbc-gold"
                  placeholder="Ex : +221 XX XXX XX XX"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-label="Téléphone WhatsApp"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] sm:text-xs text-sbc-muted">
                <T>Adresse email</T> <span className="text-sbc-gold">*</span>
              </label>
              <input
                type="email"
                className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs sm:text-sm text-sbc-text outline-none focus:border-sbc-gold"
                placeholder="Ex : vous@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email"
              />
            </div>

            {/* Question */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] sm:text-xs text-sbc-muted">
                <T>Votre question</T> <span className="text-sbc-gold">*</span>
              </label>
              <textarea
                className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs sm:text-sm text-sbc-text outline-none focus:border-sbc-gold min-h-[120px]"
                placeholder="Expliquez votre question le plus clairement possible."
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                aria-label="Votre question"
              />
            </div>

            {/* Petit texte de contexte */}
            <p className="text-[10px] sm:text-[11px] text-sbc-muted leading-relaxed">
              <T>
                Vos coordonnées ne sont utilisées que pour vous répondre, jamais
                pour vous spammer. En envoyant ce formulaire, vous acceptez que
                notre équipe vous contacte pour vous apporter des précisions ou
                vous orienter vers la documentation adaptée.
              </T>
            </p>

            {/* Bouton */}
            <div className="flex flex-wrap gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs sm:text-sm font-semibold hover:bg-sbc-goldSoft hover:text-sbc-bg transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <T>{loading ? "Envoi en cours..." : "Envoyer ma question"}</T>
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
