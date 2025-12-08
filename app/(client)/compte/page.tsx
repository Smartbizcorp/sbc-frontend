"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type Profile = {
  fullName: string;
  phone: string;
  email: string | null;
  waveNumber: string;
  orangeMoneyNumber: string | null;
  country: string | null;
  city: string | null;
  birthDate: string | null;
  idType: string | null;
  idNumber: string | null;
  securityQuestion: string | null;
};

export default function ComptePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [errorProfile, setErrorProfile] = useState("");
  const [successProfile, setSuccessProfile] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [successPassword, setSuccessPassword] = useState("");

  const ID_TYPES = ["CNI", "Passeport", "Carte consulaire"] as const;

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

  const AFRICA_COUNTRIES = [
    { code: "SN", name: "Sénégal", prefix: "+221", phoneFormat: "XX XXX XX XX" },
    { code: "CI", name: "Côte d’Ivoire", prefix: "+225", phoneFormat: "XX XX XX XX" },
    { code: "ML", name: "Mali", prefix: "+223", phoneFormat: "XX XX XX XX" },
    { code: "BF", name: "Burkina Faso", prefix: "+226", phoneFormat: "XX XX XX XX" },
    { code: "CM", name: "Cameroun", prefix: "+237", phoneFormat: "XXXX XXXX" },
    { code: "GN", name: "Guinée", prefix: "+224", phoneFormat: "XXX XX XX" },
    { code: "GA", name: "Gabon", prefix: "+241", phoneFormat: "X XX XX XX" },
    { code: "TG", name: "Togo", prefix: "+228", phoneFormat: "XX XX XX XX" },
    { code: "BJ", name: "Bénin", prefix: "+229", phoneFormat: "XX XX XX XX" },
  ] as const;

  // 🔐 États pour le changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    waveNumber: "",
    orangeMoneyNumber: "",
    country: "",
    city: "",
    birthDate: "",
    idType: "",
    idNumber: "",
    securityQuestion: "",
    securityAnswer: "",
  });

  // 👁️ Icônes SVG pour yeux (show/hide)
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

  useEffect(() => {
    async function load() {
      try {
        const rawUser = localStorage.getItem("sbc_user");
        if (!rawUser) {
          router.push("/login");
          return;
        }

        const res = await fetch(`${API_URL}/api/profile`, {
          credentials: "include",
        });

        const json = await res.json();

        if (!res.ok || !json.success) {
          if (res.status === 401) {
            localStorage.removeItem("sbc_user");
            router.push("/login");
            return;
          }
          throw new Error(json.message || "Erreur lors du chargement du profil.");
        }

        const p: Profile = json.profile;
        setProfile(p);

        setForm({
          email: p.email || "",
          waveNumber: p.waveNumber || "",
          orangeMoneyNumber: p.orangeMoneyNumber || "",
          country: p.country || "",
          city: p.city || "",
          birthDate: p.birthDate ? p.birthDate.substring(0, 10) : "",
          idType: p.idType || "",
          idNumber: p.idNumber || "",
          securityQuestion: p.securityQuestion || "",
          securityAnswer: "",
        });
      } catch (e: any) {
        console.error(e);
        setErrorProfile(e?.message || "Erreur lors du chargement du profil.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setErrorProfile("");
    setSuccessProfile("");

    try {
      const payload: any = {
        email: form.email.trim(),
        waveNumber: form.waveNumber.trim(),
        orangeMoneyNumber: form.orangeMoneyNumber.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        idType: form.idType.trim(),
        idNumber: form.idNumber.trim(),
        securityQuestion: form.securityQuestion.trim(),
      };

      if (form.birthDate) payload.birthDate = new Date(form.birthDate).toISOString();
      if (form.securityAnswer.trim() !== "")
        payload.securityAnswer = form.securityAnswer.trim();

      const res = await fetch(`${API_URL}/api/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.message || "Erreur lors de la mise à jour du profil.");

      const updated: Profile = json.profile;
      setProfile(updated);
      setSuccessProfile("Profil mis à jour avec succès.");

      setForm((prev) => ({
        ...prev,
        securityAnswer: "",
        birthDate: updated.birthDate
          ? updated.birthDate.substring(0, 10)
          : prev.birthDate,
      }));
    } catch (e: any) {
      console.error(e);
      setErrorProfile(e?.message || "Erreur lors de la mise à jour du profil.");
    } finally {
      setSavingProfile(false);
    }
  };

  // ✅ même logique que le backend : min 8 + 1 lettre + 1 chiffre
  const isStrongPassword = (pwd: string) =>
    pwd.length >= 8 && /[A-Za-z]/.test(pwd) && /\d/.test(pwd);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorPassword("");
    setSuccessPassword("");

    const newPwd = newPassword.trim();
    const confirmPwd = confirmPassword.trim();

    if (!isStrongPassword(newPwd)) {
      setErrorPassword(
        "Le nouveau mot de passe doit contenir au moins 8 caractères, avec au moins une lettre et un chiffre."
      );
      return;
    }

    if (newPwd !== confirmPwd) {
      setErrorPassword("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setSavingPassword(true);

      const res = await fetch(`${API_URL}/api/profile/password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPassword.trim(),
          newPassword: newPwd,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.message || "Erreur lors du changement de mot de passe.");

      setSuccessPassword(
        json.message || "Votre mot de passe a été mis à jour avec succès."
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      console.error(e);
      setErrorPassword(
        e?.message || "Erreur lors du changement de mot de passe."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <div className="text-xs md:text-sm text-sbc-muted">Chargement...</div>;
  }

  if (!profile) {
    return <div className="text-xs md:text-sm text-red-300">Erreur profil.</div>;
  }

  const birthLocked = !!profile.birthDate;

  // 🧠 Calculs pour jauge & checklist
  const hasLength = newPassword.length >= 8;
  const hasLetter = /[A-Za-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasUpper = /[A-Z]/.test(newPassword);

  const passwordScore = (() => {
    let score = 0;
    if (hasLength) score++;
    if (hasLetter) score++;
    if (hasNumber) score++;
    if (hasUpper) score++;
    return score;
  })();

  const strengthLabel = (() => {
    if (!newPassword) return "";
    if (passwordScore <= 1) return "Sécurité faible";
    if (passwordScore === 2 || passwordScore === 3) return "Sécurité moyenne";
    return "Sécurité forte";
  })();

  const strengthBarClass = (() => {
    if (!newPassword) return "bg-sbc-border";
    if (passwordScore <= 1) return "bg-red-500";
    if (passwordScore === 2 || passwordScore === 3) return "bg-amber-500";
    return "bg-emerald-500";
  })();

  const strengthBarWidth = (() => {
    if (!newPassword) return "0%";
    return `${(passwordScore / 4) * 100}%`;
  })();

  const passwordsMatch =
    !confirmPassword || newPassword === confirmPassword;

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* HEADER */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.26em] text-sbc-gold">
            Compte
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold mt-1">
            Paramètres du profil
          </h1>
          <p className="text-xs md:text-sm text-sbc-muted max-w-xl mt-2 leading-relaxed">
            Gérez vos informations personnelles, vos coordonnées de paiement et
            la sécurité votre compte Smart Business Corp.
          </p>
        </div>
        <div className="text-xs md:text-sm text-sbc-muted">
          <p>Client</p>
          <p className="text-sbc-text font-medium">{profile.fullName}</p>
          <p className="text-[11px]">{profile.phone}</p>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-2 px-4 py-1 rounded-full border border-sbc-gold text-sbc-gold text-[10px] md:text-xs font-semibold hover:bg-sbc-gold hover:text-sbc-bgSoft transition"
          >
            Mon Dashboard
          </button>
        </div>
      </section>

      {/* INFOS PERSONNELLES */}
      <section className="bg-sbc-bgSoft/70 border border-sbc-border rounded-3xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        <h2 className="text-sm md:text-base font-semibold text-sbc-gold mb-3">
          Infos personnelles
        </h2>

        {errorProfile && (
          <div className="mb-3 text-[11px] md:text-xs text-red-400 bg-red-950/30 border border-red-700/50 rounded-2xl px-3 py-2">
            {errorProfile}
          </div>
        )}
        {successProfile && (
          <div className="mb-3 text-[11px] md:text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-700/50 rounded-2xl px-3 py-2">
            {successProfile}
          </div>
        )}

        <form
          onSubmit={handleProfileSubmit}
          className="flex flex-col gap-4 md:gap-5"
        >
          {/* NOM + TELEPHONE */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] md:text-xs text-sbc-muted">
                Nom complet
              </label>
              <input
                type="text"
                value={profile.fullName}
                disabled
                className="rounded-2xl border border-sbc-border/60 bg-sbc-bgSoft/60 px-3 py-2 text-xs md:text-sm text-sbc-text/80 outline-none cursor-not-allowed"
              />
              <p className="text-[10px] text-sbc-muted">Non modifiable.</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] md:text-xs text-sbc-muted">
                Téléphone
              </label>
              <input
                type="tel"
                value={profile.phone}
                disabled
                className="rounded-2xl border border-sbc-border/60 bg-sbc-bgSoft/60 px-3 py-2 text-xs md:text-sm text-sbc-text/80 outline-none cursor-not-allowed"
              />
              <p className="text-[10px] text-sbc-muted">Non modifiable.</p>
            </div>
          </div>

          {/* EMAIL + DATE */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] md:text-xs text-sbc-muted">
                Adresse e-mail
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleProfileChange}
                className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] md:text-xs text-sbc-muted">
                Date de naissance
              </label>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleProfileChange}
                disabled={birthLocked}
                className={`rounded-2xl border px-3 py-2 text-xs md:text-sm text-sbc-text outline-none ${
                  birthLocked
                    ? "border-sbc-border/60 bg-sbc-bgSoft/60 cursor-not-allowed"
                    : "border-sbc-border bg-sbc-bgSoft focus:border-sbc-gold transition"
                }`}
              />
              <p className="text-[10px] text-sbc-muted">
                {birthLocked
                  ? "Non modifiable."
                  : "Sera verrouillée après validation."}
              </p>
            </div>
          </div>

          {/* IDENTITE */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] md:text-xs text-sbc-muted">
                Pièce d’identité
              </label>
              <select
                name="idType"
                value={form.idType}
                onChange={handleProfileChange}
                className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold transition"
              >
                <option value="">Sélectionnez une pièce</option>
                {ID_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] md:text-xs text-sbc-muted">
                Numéro de la pièce
              </label>
              <input
                type="text"
                name="idNumber"
                value={form.idNumber}
                onChange={handleProfileChange}
                className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold transition"
              />
            </div>
          </div>

          {/* PAIEMENT */}
          <div className="mt-4 pt-4 border-t border-sbc-border/40">
            <h3 className="text-[11px] md:text-xs uppercase tracking-[0.18em] text-sbc-gold mb-3">
              Infos de paiement
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] md:text-xs text-sbc-muted">
                  Numéro Wave
                </label>
                <input
                  type="tel"
                  name="waveNumber"
                  value={form.waveNumber}
                  onChange={handleProfileChange}
                  className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] md:text-xs text-sbc-muted">
                  Numéro Orange Money
                </label>
                <input
                  type="tel"
                  name="orangeMoneyNumber"
                  value={form.orangeMoneyNumber}
                  onChange={handleProfileChange}
                  className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold transition"
                />
              </div>
            </div>
          </div>

          {/* LOCALISATION */}
          <div className="mt-4 pt-4 border-t border-sbc-border/40">
            <h3 className="text-[11px] md:text-xs uppercase tracking-[0.18em] text-sbc-gold mb-3">
              Localisation
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] md:text-xs text-sbc-muted">
                  Pays
                </label>
                <select
                  name="country"
                  value={form.country}
                  onChange={(e) => {
                    handleProfileChange(e);
                    const selected = AFRICA_COUNTRIES.find(
                      (c) => c.name === e.target.value
                    );
                    if (selected) {
                      setForm((prev) => ({
                        ...prev,
                        waveNumber: selected.prefix,
                        orangeMoneyNumber: selected.prefix,
                      }));
                    }
                  }}
                  className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold transition"
                >
                  <option value="">Choisissez un pays</option>
                  {AFRICA_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name} ({c.prefix})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] md:text-xs text-sbc-muted">
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleProfileChange}
                  className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold transition"
                />
              </div>
            </div>
          </div>

          {/* QUESTION SECURITE */}
          <div className="mt-4 pt-4 border-t border-sbc-border/40">
            <h3 className="text-[11px] md:text-xs uppercase tracking-[0.18em] text-sbc-gold mb-3">
              Question de sécurité
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] md:text-xs text-sbc-muted">
                  Question
                </label>
                <select
                  name="securityQuestion"
                  value={form.securityQuestion}
                  onChange={handleProfileChange}
                  className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold transition"
                >
                  <option value="">Sélectionnez une question</option>
                  {SECURITY_QUESTIONS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] md:text-xs text-sbc-muted">
                  Réponse
                </label>
                <input
                  type="text"
                  name="securityAnswer"
                  value={form.securityAnswer}
                  onChange={handleProfileChange}
                  className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold transition"
                />
                <p className="text-[10px] text-sbc-muted">
                  Stockée de manière sécurisée.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-2 rounded-full border border-sbc-gold bg-sbc-gold text-sbc-bgSoft text-xs md:text-sm font-semibold transition disabled:opacity-60"
            >
              {savingProfile ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </section>

      {/* MDP */}
      <section className="bg-sbc-bgSoft/70 border border-sbc-border rounded-3xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        <h2 className="text-sm md:text-base font-semibold text-sbc-gold mb-3">
          Sécurité du compte
        </h2>

        {errorPassword && (
          <div className="mb-3 text-[11px] md:text-xs text-red-400 bg-red-950/30 border border-red-700/50 rounded-2xl px-3 py-2">
            {errorPassword}
          </div>
        )}
        {successPassword && (
          <div className="mb-3 text-[11px] md:text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-700/50 rounded-2xl px-3 py-2">
            {successPassword}
          </div>
        )}

        <form
          onSubmit={handlePasswordSubmit}
          className="flex flex-col gap-4 md:gap-5"
        >
          <div className="flex flex-col gap-1">
            <label className="text-[11px] md:text-xs text-sbc-muted">
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold transition"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Nouveau mot de passe */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] md:text-xs text-sbc-muted">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 pr-9 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sbc-muted hover:text-sbc-gold transition"
                  aria-label={
                    showNewPassword
                      ? "Masquer le nouveau mot de passe"
                      : "Afficher le nouveau mot de passe"
                  }
                >
                  {showNewPassword ? <EyeOffIcon /> : <EyeOpenIcon />}
                </button>
              </div>

              {/* Jauge de sécurité */}
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

              {/* Checklist dynamique */}
              <ul className="mt-2 space-y-1 text-[10px] text-sbc-muted">
                <li className="flex items-center gap-1">
                  <span
                    className={hasLength ? "text-emerald-400" : "text-sbc-muted"}
                  >
                    ●
                  </span>
                  <span>Au moins 8 caractères</span>
                </li>
                <li className="flex items-center gap-1">
                  <span
                    className={hasLetter ? "text-emerald-400" : "text-sbc-muted"}
                  >
                    ●
                  </span>
                  <span>Contient des lettres (a–z)</span>
                </li>
                <li className="flex items-center gap-1">
                  <span
                    className={hasNumber ? "text-emerald-400" : "text-sbc-muted"}
                  >
                    ●
                  </span>
                  <span>Contient des chiffres (0–9)</span>
                </li>
                <li className="flex items-center gap-1">
                  <span
                    className={hasUpper ? "text-emerald-400" : "text-sbc-muted"}
                  >
                    ●
                  </span>
                  <span>Majuscule recommandée (A–Z)</span>
                </li>
              </ul>
            </div>

            {/* Confirmer le mot de passe */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] md:text-xs text-sbc-muted">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-sbc-border bg-sbc-bgSoft px-3 py-2 pr-9 text-xs md:text-sm text-sbc-text outline-none focus:border-sbc-gold transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
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

          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-5 py-2 rounded-full border border-sbc-gold bg-transparent text-sbc-gold text-xs md:text-sm font-semibold hover:bg-sbc-gold/10 transition disabled:opacity-60"
            >
              {savingPassword ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
