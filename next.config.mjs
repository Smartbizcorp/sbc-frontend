/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 🌍 Internationalisation (i18n)
  i18n: {
    locales: [
      "fr", // Français (par défaut)
      "en", // English
      "es", // Español (optionnel)
      "pt", // Português (optionnel)
      "ar", // العربية (optionnel)
    ],
    defaultLocale: "fr",
    localeDetection: true, // détecte la langue du navigateur
  },

  // 🚀 Optimisations Vercel
  poweredByHeader: false,
  compress: true,

  // 🧠 Sécurité basique
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
};

export default nextConfig;
