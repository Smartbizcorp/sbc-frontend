"use client";

import { useState } from "react";

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
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // optionnel, mais OK si un jour on lie la question à un compte
        body: JSON.stringify({ name, phone, email, question }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erreur lors de l'envoi.");
      }

      setSuccess("Votre question a été envoyée avec succès. Nous vous répondrons par email ou WhatsApp.");
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
    <div className="max-w-3xl mx-auto flex flex-col gap-8 md:gap-10">
      {/* HEADER / CONTEXTE */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-6 md:p-8 shadow-[0_20px_55px_rgba(0,0,0,0.85)] backdrop-blur-lg flex flex-col gap-3">
        <p className="text-[11px] uppercase tracking-[0.25em] text-sbc-gold">
          FAQ • Question
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Posez votre question à l&apos;équipe Smart Business Corp
        </h1>
        <p className="text-xs md:text-sm text-sbc-muted leading-relaxed">
          Utilisez ce formulaire pour nous poser une question précise sur le fonctionnement,
          les retraits, les paliers ou la gestion du risque. Nous reviendrons vers vous
          dès que possible avec une réponse claire.
        </p>
      </section>

      {/* FORMULAIRE */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col gap-4">
        {success && (
          <div className="text-[11px] md:text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-700/50 rounded-2xl px-3 py-2">
            {success}
          </div>
        )}

        {error && (
          <div className="text-[11px] md:text-xs text-red-400 bg-red-950/30 border border-red-700/50 rounded-2xl px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Identité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-sbc-muted">
                Nom complet <span className="text-sbc-gold">*</span>
              </label>
              <input
                className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold"
                placeholder="Ex : Jean Dupont"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-sbc-muted">
                Numéro de téléphone (WhatsApp) <span className="text-sbc-gold">*</span>
              </label>
              <input
                className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold"
                placeholder="Ex : +221 XX XXX XX XX"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-sbc-muted">
              Adresse email <span className="text-sbc-gold">*</span>
            </label>
            <input
              type="email"
              className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold"
              placeholder="Ex : vous@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Question */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-sbc-muted">
              Votre question <span className="text-sbc-gold">*</span>
            </label>
            <textarea
              className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold min-h-[120px]"
              placeholder="Expliquez votre question le plus clairement possible."
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* Petit texte de contexte */}
          <p className="text-[10px] md:text-[11px] text-sbc-muted leading-relaxed">
            Vos coordonnées ne sont utilisées que pour vous répondre, jamais pour vous
            spammer. En envoyant ce formulaire, vous acceptez que notre équipe vous
            contacte pour vous apporter des précisions ou vous orienter vers la
            documentation adaptée.
          </p>

          {/* Bouton */}
          <div className="flex flex-wrap gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs md:text-sm font-semibold hover:bg-sbc-goldSoft hover:text-sbc-bg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Envoi en cours..." : "Envoyer ma question"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
