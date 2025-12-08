"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function ForgotPasswordSecurityClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";

  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loadingQuestion, setLoadingQuestion] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // mêmes règles que register
  const hasLength = newPassword.length >= 8;
  const hasLetter = /[A-Za-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasUpper = /[A-Z]/.test(newPassword);

  const isStrongPassword = (pwd: string) =>
    pwd.length >= 8 && /[A-Za-z]/.test(pwd) && /[0-9]/.test(pwd);

  const passwordScore = useMemo(() => {
    let score = 0;
    if (hasLength) score++;
    if (hasLetter) score++;
    if (hasNumber) score++;
    if (hasUpper) score++;
    return score;
  }, [hasLength, hasLetter, hasNumber, hasUpper]);

  const strengthLabel = useMemo(() => {
    if (!newPassword) return "";
    if (passwordScore <= 1) return "Sécurité faible";
    if (passwordScore === 2 || passwordScore === 3) return "Sécurité moyenne";
    return "Sécurité forte";
  }, [newPassword, passwordScore]);

  const strengthBarClass = useMemo(() => {
    if (!newPassword) return "bg-sbc-border";
    if (passwordScore <= 1) return "bg-red-500";
    if (passwordScore === 2 || passwordScore === 3) return "bg-amber-500";
    return "bg-emerald-500";
  }, [newPassword, passwordScore]);

  const strengthBarWidth = useMemo(() => {
    if (!newPassword) return "0%";
    return `${(passwordScore / 4) * 100}%`;
  }, [newPassword, passwordScore]);

  const passwordsMatch =
    !confirmPassword || newPassword === confirmPassword;

  // Icônes œil
  const EyeOpenIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.18 3.24" />
      <path d="M1 1l22 22" />
    </svg>
  );

  // Charger la question de sécurité
  useEffect(() => {
    if (!phone) {
      setErrorMessage(
        "Numéro de téléphone manquant. Merci de recommencer la procédure."
      );
      setLoadingQuestion(false);
      return;
    }

    const loadQuestion = async () => {
      try {
        setLoadingQuestion(true);
        setErrorMessage("");
        const res = await fetch(`${API_URL}/api/password-reset/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(
            data.message ||
              "Erreur lors du chargement de la question de sécurité."
          );
        }

        setSecurityQuestion(data.securityQuestion || "");
      } catch (err: any) {
        setErrorMessage(
          err?.message ||
            "Erreur lors du chargement de la question de sécurité."
        );
      } finally {
        setLoadingQuestion(false);
      }
    };

    loadQuestion();
  }, [phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!securityAnswer.trim()) {
      setErrorMessage("Merci de renseigner la réponse à la question de sécurité.");
      setSubmitting(false);
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setErrorMessage(
        "Mot de passe trop faible : min 8 caractères, au moins 1 lettre et 1 chiffre."
      );
      setSubmitting(false);
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/password-reset/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          securityAnswer,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Erreur lors de la réinitialisation du mot de passe."
        );
      }

      setSuccessMessage(
        data.message ||
          "Mot de passe réinitialisé. Vous pouvez maintenant vous connecter."
      );
      setSecurityAnswer("");
      setNewPassword("");
      setConfirmPassword("");

      // Optionnel : redirection
      // setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Erreur lors de la réinitialisation du mot de passe."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!phone) {
    return (
      <div className="max-w-md mx-auto text-xs md:text-sm text-red-300">
        Numéro de téléphone manquant dans l&apos;URL.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-8 shadow">
        <p className="uppercase text-[11px] tracking-[0.25em] text-sbc-gold">
          Mot de passe oublié
        </p>
        <h1 className="text-2xl md:text-3xl font-semibold mt-2 mb-3">
          Vérification de sécurité
        </h1>
        <p className="text-xs md:text-sm text-sbc-muted leading-relaxed">
          Répondez à votre question de sécurité puis choisissez un nouveau mot
          de passe pour votre compte associé au numéro{" "}
          <span className="text-sbc-gold font-semibold">{phone}</span>.
        </p>
      </section>

      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-8 shadow">
        {loadingQuestion ? (
          <p className="text-xs text-sbc-muted">Chargement de la question...</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {errorMessage && (
              <div className="text-xs text-red-400 bg-red-950/30 border border-red-700/40 rounded-2xl px-3 py-2">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-700/40 rounded-2xl px-3 py-2">
                {successMessage}
              </div>
            )}

            {/* Question de sécurité */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] md:text-xs text-sbc-muted">
                Question de sécurité
              </label>
              <div className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text">
                {securityQuestion || "Aucune question de sécurité définie."}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] md:text-xs text-sbc-muted">
                Votre réponse
              </label>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
                className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold transition"
              />
            </div>

            {/* Nouveau mot de passe + confirmation + jauge */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-sbc-muted mb-1">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-sm text-sbc-text pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sbc-muted hover:text-sbc-gold transition"
                    aria-label={
                      showNewPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showNewPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
                  </button>
                </div>

                {/* Jauge */}
                <div className="mt-2 space-y-1">
                  <div className="w-full h-1.5 rounded-full bg-sbc-bg/80 overflow-hidden">
                    <div
                      className={`h-full ${strengthBarClass} transition-all duration-300`}
                      style={{ width: strengthBarWidth }}
                    />
                  </div>
                  {strengthLabel && (
                    <p className="text-[10px] text-sbc-muted">
                      {strengthLabel}
                    </p>
                  )}
                </div>

                {/* Checklist */}
                <ul className="mt-2 space-y-1 text-[10px] text-sbc-muted">
                  <li className="flex items-center gap-1">
                    <span
                      className={
                        hasLength ? "text-emerald-400" : "text-sbc-muted"
                      }
                    >
                      ●
                    </span>
                    <span>Au moins 8 caractères</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span
                      className={
                        hasLetter ? "text-emerald-400" : "text-sbc-muted"
                      }
                    >
                      ●
                    </span>
                    <span>Contient des lettres (a–z)</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span
                      className={
                        hasNumber ? "text-emerald-400" : "text-sbc-muted"
                      }
                    >
                      ●
                    </span>
                    <span>Contient des chiffres (0–9)</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span
                      className={
                        hasUpper ? "text-emerald-400" : "text-sbc-muted"
                      }
                    >
                      ●
                    </span>
                    <span>Majuscule recommandée (A–Z)</span>
                  </li>
                </ul>
              </div>

              {/* Confirmation */}
              <div>
                <label className="block text-xs font-medium text-sbc-muted mb-1">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-sm text-sbc-text pr-9"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sbc-muted hover:text-sbc-gold transition"
                    aria-label={
                      showConfirmPassword
                        ? "Masquer la confirmation"
                        : "Afficher la confirmation"
                    }
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
                {!passwordsMatch && (
                  <p className="mt-1 text-[10px] text-red-400">
                    Les mots de passe ne correspondent pas.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="px-4 py-2 rounded-full border border-sbc-border bg-transparent text-xs md:text-sm text-sbc-muted hover:bg-sbc-bg/70 transition"
              >
                Retour à la connexion
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bgSoft text-xs md:text-sm font-semibold hover:bg-sbc-gold/90 transition disabled:opacity-60"
              >
                {submitting
                  ? "Réinitialisation..."
                  : "Réinitialiser le mot de passe"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
