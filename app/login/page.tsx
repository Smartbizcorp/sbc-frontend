"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { normalizeSenegalPhone } from "@/src/utils/phone";
import { login as apiLogin } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Détection auto d'utilisateur connecté
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("sbc_user");
    if (stored) router.push("/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    // Vérification format Sénégal
    if (!/^\+221\d{9}$/.test(phone)) {
      setErrorMessage(
        "Nous n'acceptons pour le moment que les numéros du Sénégal au format +221XXXXXXXXX."
      );
      setLoading(false);
      return;
    }

    try {
      // Passe par lib/api.ts → POST /api/login (avec credentials: "include")
      const data = await apiLogin({
        phone: phone.trim(),
        password: password.trim(),
      });

      if (!data || (typeof data === "object" && data.success === false)) {
        throw new Error((data as any)?.message || "Erreur de connexion.");
      }

      // Le backend renvoie { success, user: {...} }
      const user = (data as any).user;
      if (user) {
        localStorage.setItem("sbc_user", JSON.stringify(user));
      }

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] w-full max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-10 flex flex-col gap-5 sm:gap-6 md:gap-8">
      {/* Bandeau intro */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_20px_55px_rgba(0,0,0,0.9)]">
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-sbc-gold mb-1.5 sm:mb-2">
          Connexion
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-3 leading-snug">
          Accédez à votre espace
        </h1>
        <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed">
          Connectez-vous pour suivre votre portefeuille Smart Business Corp.
        </p>
      </section>

      {/* Formulaire */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.85)]">
        <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="text-[11px] sm:text-xs text-red-400 bg-red-950/30 border border-red-700/50 rounded-2xl px-3 py-2">
              {errorMessage}
            </div>
          )}

          {/* Téléphone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] sm:text-xs text-sbc-muted">
              Téléphone (WhatsApp){" "}
              <span className="text-sbc-gold">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(normalizeSenegalPhone(e.target.value))}
              className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-sm text-sbc-text focus:border-sbc-gold outline-none"
              placeholder="+221 77 000 00 00"
            />
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] sm:text-xs text-sbc-muted">
              Mot de passe <span className="text-sbc-gold">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-sm text-sbc-text focus:border-sbc-gold outline-none"
              placeholder="Votre mot de passe"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs sm:text-sm font-semibold hover:bg-sbc-goldSoft transition disabled:opacity-60"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="mt-3 flex flex-col gap-1">
            <Link
              href="/forgot-password"
              className="text-[11px] sm:text-xs text-sbc-muted underline hover:text-sbc-gold"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Link
            href="/register"
            className="text-[11px] sm:text-xs text-sbc-muted underline hover:text-sbc-gold mt-2"
          >
            Créer un compte
          </Link>
        </form>
      </section>
    </div>
  );
}
