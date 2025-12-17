"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { normalizeSenegalPhone } from "@/src/utils/phone";
import { register as apiRegister } from "../../lib/api";
import { trackEvent } from "@/lib/analytics";
import { T } from "@/components/T";
import { useTr } from "@/lib/useTr";


const SECURITY_QUESTIONS = [
  "Nom de votre premier établissement scolaire",
  "Nom de votre meilleur ami d’enfance",
  "Nom de votre premier animal de compagnie",
  "Ville où vous avez grandi",
  "Métier rêvé quand vous étiez enfant",
  "Marque de votre premier téléphone",
  "Ville de naissance de votre mère",
  "Lieu de votre premier emploi",
  "Plat préféré de votre enfance",
  "Titre du premier film vu au cinéma",
] as const;

const CGU_CONTENT = `
Conditions Générales d’Utilisation — Smart Business Corp

1) Objet
Ces CGU encadrent l’accès et l’utilisation de la plateforme Smart Business Corp.

2) Accès au service
L’accès peut être limité selon les vagues d’inscription et les critères d’éligibilité.

3) Sécurité & Compte
Vous êtes responsable de la confidentialité de votre mot de passe et de vos informations.

4) Retraits
Les retraits peuvent être limités et soumis aux règles affichées sur la plateforme.

5) Données personnelles
Les données sont traitées conformément à notre politique de confidentialité.

6) Acceptation
En cochant la case, vous acceptez l’intégralité des CGU.

(Version courte — remplace ce texte par tes CGU complètes.)
`.trim();

export default function RegisterPage() {
  const { tr } = useTr();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [waveNumber, setWaveNumber] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  const [acceptCgu, setAcceptCgu] = useState(false);
  const [showCguModal, setShowCguModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // --- RÈGLES DE SÉCURITÉ ---
  const hasLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);

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
    if (!password) return "";
    if (passwordScore <= 1) return "Sécurité faible";
    if (passwordScore === 2 || passwordScore === 3) return "Sécurité moyenne";
    return "Sécurité forte";
  }, [password, passwordScore]);

  const strengthBarClass = useMemo(() => {
    if (!password) return "bg-sbc-border";
    if (passwordScore <= 1) return "bg-red-500";
    if (passwordScore === 2 || passwordScore === 3) return "bg-amber-500";
    return "bg-emerald-500";
  }, [password, passwordScore]);

  const strengthBarWidth = useMemo(() => {
    if (!password) return "0%";
    return `${(passwordScore / 4) * 100}%`;
  }, [password, passwordScore]);

  const passwordsMatch =
    confirmPassword.length === 0 || password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (!/^\+221\d{9}$/.test(phone)) {
      setErrorMessage(
        "Nous n'acceptons pour le moment que les numéros du Sénégal au format +221XXXXXXXXX."
      );
      setLoading(false);
      return;
    }

    if (!/^\+221\d{9}$/.test(waveNumber)) {
      setErrorMessage(
        "Votre numéro Wave doit aussi être un numéro du Sénégal au format +221XXXXXXXXX."
      );
      setLoading(false);
      return;
    }

    if (!isStrongPassword(password)) {
      setErrorMessage(
        "Mot de passe trop faible : min 8 caractères, au moins 1 lettre et 1 chiffre."
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (!securityQuestion) {
      setErrorMessage("Veuillez choisir une question de sécurité.");
      setLoading(false);
      return;
    }

    if (!securityAnswer.trim()) {
      setErrorMessage("Veuillez renseigner la réponse à la question de sécurité.");
      setLoading(false);
      return;
    }

    if (!acceptCgu) {
      setErrorMessage(
        "Veuillez accepter les Conditions Générales d’Utilisation (CGU) pour continuer."
      );
      setLoading(false);
      return;
    }

    try {
      const data = await apiRegister({
        fullName,
        phone,
        email,
        waveNumber,
        password,
        securityQuestion,
        securityAnswer,
        acceptCgu,
      } as any);

      if (!data || (typeof data === "object" && (data as any).success === false)) {
        throw new Error((data as any)?.message || "Erreur lors de l'inscription.");
      }

      setSuccessMessage("Compte créé ! Vous pouvez vous connecter.");
      trackEvent("register_success", { method: "phone" });

      setFullName("");
      setPhone("");
      setEmail("");
      setWaveNumber("");
      setPassword("");
      setConfirmPassword("");
      setSecurityQuestion("");
      setSecurityAnswer("");
      setAcceptCgu(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur lors de l'inscription.");
      trackEvent("register_error", { reason: "api_error" });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 md:px-0 flex flex-col gap-6 sm:gap-8 md:gap-10">
      {/* HEADER */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.85)]">
        <p className="uppercase text-[10px] sm:text-[11px] tracking-[0.25em] text-sbc-gold">
          <T>Inscription</T>
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-[32px] font-semibold mt-2 mb-2 sm:mb-3 leading-snug">
          <T>Créez votre compte Smart Business Corp</T>
        </h1>
        <p className="text-xs sm:text-sm text-sbc-muted leading-relaxed max-w-xl">
          <T>Inscrivez-vous pour commencer à investir et suivre vos gains.</T>
        </p>
      </section>

      {/* FORMULAIRE */}
      <section className="bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        <form className="flex flex-col gap-5 sm:gap-6" onSubmit={handleSubmit}>
          {successMessage && (
            <div className="text-[10px] sm:text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-700/40 rounded-2xl px-3 py-2">
              <T>{successMessage}</T>
            </div>
          )}

          {errorMessage && (
            <div className="text-[10px] sm:text-xs text-red-400 bg-red-950/30 border border-red-700/40 rounded-2xl px-3 py-2">
              <T>{errorMessage}</T>
            </div>
          )}

          {/* Nom + téléphone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder={tr("Nom complet")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs sm:text-sm text-sbc-text outline-none focus:border-sbc-gold"
              aria-label={tr("Nom complet")}
            />

            <input
              type="tel"
              required
              placeholder={tr("+221 77 000 00 00")}
              value={phone}
              onChange={(e) => setPhone(normalizeSenegalPhone(e.target.value))}
              className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs sm:text-sm text-sbc-text outline-none focus:border-sbc-gold"
              aria-label={tr("Téléphone")}
            />
          </div>

          {/* Email */}
          <input
            type="email"
            placeholder={tr("Adresse email (optionnelle)")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs sm:text-sm text-sbc-text outline-none focus:border-sbc-gold"
            aria-label={tr("Email")}
          />

          {/* Password + confirm + jauge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-[11px] text-sbc-muted mb-1">
                <T>Mot de passe</T>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={tr("Mot de passe sécurisé")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs sm:text-sm text-sbc-text pr-9 outline-none focus:border-sbc-gold"
                  aria-label={tr("Mot de passe")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sbc-muted hover:text-sbc-gold transition"
                  aria-label={tr(
                    showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
                  )}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
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
                    <T>{strengthLabel}</T>
                  </p>
                )}
              </div>

              {/* Checklist */}
              <ul className="mt-2 space-y-1 text-[10px] text-sbc-muted">
                <li className="flex items-center gap-1">
                  <span className={hasLength ? "text-emerald-400" : "text-sbc-muted"}>●</span>
                  <span><T>Au moins 8 caractères</T></span>
                </li>
                <li className="flex items-center gap-1">
                  <span className={hasLetter ? "text-emerald-400" : "text-sbc-muted"}>●</span>
                  <span><T>Contient des lettres (a–z)</T></span>
                </li>
                <li className="flex items-center gap-1">
                  <span className={hasNumber ? "text-emerald-400" : "text-sbc-muted"}>●</span>
                  <span><T>Contient des chiffres (0–9)</T></span>
                </li>
                <li className="flex items-center gap-1">
                  <span className={hasUpper ? "text-emerald-400" : "text-sbc-muted"}>●</span>
                  <span><T>Majuscule recommandée (A–Z)</T></span>
                </li>
              </ul>
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-[11px] text-sbc-muted mb-1">
                <T>Confirmer le mot de passe</T>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder={tr("Confirmer le mot de passe")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs sm:text-sm text-sbc-text pr-9 outline-none focus:border-sbc-gold"
                  aria-label={tr("Confirmer le mot de passe")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sbc-muted hover:text-sbc-gold transition"
                  aria-label={tr(
                    showConfirmPassword ? "Masquer la confirmation" : "Afficher la confirmation"
                  )}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
                </button>
              </div>

              {!passwordsMatch && (
                <p className="mt-1 text-[10px] text-red-400">
                  <T>Les mots de passe ne correspondent pas.</T>
                </p>
              )}
            </div>
          </div>

          {/* Wave */}
          <div>
            <label className="block text-[11px] text-sbc-muted mb-1">
              <T>Numéro Wave</T>
            </label>
            <input
              type="tel"
              required
              placeholder={tr("Numéro Wave (+221...)")}
              value={waveNumber}
              onChange={(e) => setWaveNumber(normalizeSenegalPhone(e.target.value))}
              className="w-full rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs sm:text-sm text-sbc-text outline-none focus:border-sbc-gold"
              aria-label={tr("Numéro Wave")}
            />
          </div>

          {/* Security */}
          <div className="mt-2 pt-3 border-t border-sbc-border/40">
            <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-sbc-gold mb-2">
              <T>Question de sécurité (obligatoire)</T>
            </h3>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] text-sbc-muted mb-1">
                  <T>Question</T>
                </label>
                <select
                  required
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  className="w-full rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs sm:text-sm text-sbc-text outline-none focus:border-sbc-gold"
                  aria-label={tr("Question")}
                >
                  <option value="">{tr("Sélectionnez une question")}</option>
                  {SECURITY_QUESTIONS.map((q) => (
                    <option key={q} value={q}>
                      {tr(q)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-sbc-muted mb-1">
                  <T>Réponse</T>
                </label>
                <input
                  type="text"
                  required
                  placeholder={tr("Votre réponse (secrète)")}
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  className="w-full rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs sm:text-sm text-sbc-text outline-none focus:border-sbc-gold"
                  aria-label={tr("Réponse")}
                />
                <p className="text-[10px] text-sbc-muted mt-1">
                  <T>Cette réponse vous sera demandée en cas de vérification de sécurité.</T>
                </p>
              </div>
            </div>
          </div>

          {/* CGU */}
          <div className="mt-2 pt-3 border-t border-sbc-border/40">
            <div className="flex items-start gap-3">
              <input
                id="acceptCgu"
                type="checkbox"
                checked={acceptCgu}
                onChange={(e) => setAcceptCgu(e.target.checked)}
                className="mt-1 h-4 w-4 accent-sbc-gold"
                required
                aria-label={tr("J’accepte les CGU")}
              />
              <label htmlFor="acceptCgu" className="text-[11px] sm:text-xs text-sbc-muted leading-relaxed">
                <T>J’ai lu et j’accepte les </T>
                <button
                  type="button"
                  onClick={() => setShowCguModal(true)}
                  className="underline hover:text-sbc-gold text-sbc-text"
                  aria-label={tr("Ouvrir les CGU")}
                >
                  <T>Conditions Générales d’Utilisation (CGU)</T>
                </button>
                <T>.</T>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 inline-flex items-center justify-center px-4 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bg text-xs sm:text-sm font-semibold hover:bg-sbc-goldSoft transition disabled:opacity-50"
            aria-label={tr(loading ? "Création du compte..." : "Créer mon compte")}
          >
            <T>{loading ? "Création..." : "Créer mon compte"}</T>
          </button>

          <Link
            href="/login"
            className="text-[11px] sm:text-xs text-sbc-muted underline hover:text-sbc-gold mt-1"
            aria-label={tr("Aller à la connexion")}
          >
            <T>J’ai déjà un compte</T>
          </Link>
        </form>
      </section>

      {/* MODALE CGU */}
      {showCguModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3"
          role="dialog"
          aria-modal="true"
          aria-label={tr("Conditions Générales d’Utilisation")}
          onClick={() => setShowCguModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-sbc-border bg-sbc-bgSoft shadow-[0_25px_70px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-sbc-border/50">
              <div>
                <p className="uppercase text-[10px] tracking-[0.25em] text-sbc-gold">
                  <T>CGU</T>
                </p>
                <h3 className="text-base sm:text-lg font-semibold">
                  <T>Conditions Générales d’Utilisation</T>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCguModal(false)}
                className="rounded-full border border-sbc-border px-3 py-1 text-xs text-sbc-muted hover:text-sbc-gold hover:border-sbc-gold transition"
                aria-label={tr("Fermer")}
              >
                <T>Fermer</T>
              </button>
            </div>

            <div className="px-5 sm:px-6 pt-4">
              <Link href="/cgu" className="underline hover:text-sbc-gold" aria-label={tr("Lire les CGU")}>
                <T>Lire les CGU</T>
              </Link>
            </div>

            <div className="px-5 sm:px-6 py-4 max-h-[65vh] overflow-auto">
              <pre className="whitespace-pre-wrap text-[11px] sm:text-xs text-sbc-muted leading-relaxed">
                <T>{CGU_CONTENT}</T>
              </pre>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCguModal(false)}
                  className="rounded-full border border-sbc-border px-4 py-2 text-xs sm:text-sm text-sbc-text hover:border-sbc-gold hover:text-sbc-gold transition"
                  aria-label={tr("Retour")}
                >
                  <T>Retour</T>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAcceptCgu(true);
                    setShowCguModal(false);
                  }}
                  className="rounded-full border border-sbc-gold bg-sbc-gold px-4 py-2 text-xs sm:text-sm font-semibold text-sbc-bg hover:bg-sbc-goldSoft transition"
                  aria-label={tr("J’accepte")}
                >
                  <T>J’accepte</T>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    trackEvent("cgu_open", { context: "register" });
                    setShowCguModal(true);
                  }}
                  className="rounded-full border border-sbc-border bg-sbc-bgSoft px-4 py-2 text-[11px] text-sbc-muted hover:border-sbc-gold hover:text-sbc-gold transition"
                  aria-label={tr("Lire les CGU")}
                >
                  <T>Lire les CGU</T>
                </button>
              </div>

              <p className="mt-4 text-[10px] text-sbc-muted">
                <T>Option recommandée : publier aussi une page dédiée </T>
                <span className="text-sbc-text">/cgu</span>
                <T> pour le SEO et la preuve d’accès.</T>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
