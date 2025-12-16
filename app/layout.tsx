// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Analytics } from "@vercel/analytics/react";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import { LangProvider } from "@/lib/i18n-provider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    default: "Smart Business Corp",
    template: "%s | Smart Business Corp",
  },
  description: "Plateforme d'investissement sécurisée et intelligente.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon-256.png", type: "image/png", sizes: "256x256" },
      { url: "/favicon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
};

// ✅ Next 14: themeColor doit être dans viewport (pas metadata)
export const viewport: Viewport = {
  themeColor: "#facc15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="fr">
      <body className="min-h-screen bg-sbc-bg text-sbc-text flex flex-col">
        {/* ✅ Fix build: si ton provider utilise useSearchParams, Next exige Suspense */}
        <Suspense fallback={null}>
          <LangProvider>
            <PwaInstallPrompt />
            <Header />

            <main className="flex-1 w-full">
              <div
                className="
                  mx-auto w-full
                  max-w-3xl
                  sm:max-w-4xl
                  lg:max-w-5xl
                  xl:max-w-6xl
                  px-3
                  sm:px-5
                  md:px-8
                  lg:px-12
                  xl:px-16
                  py-4
                  sm:py-6
                  md:py-8
                "
              >
                {children}
              </div>
            </main>

            <footer
              className="
                border-t border-sbc-border
                px-3
                sm:px-5
                md:px-8
                lg:px-12
                xl:px-16
                py-3
                sm:py-3.5
                md:py-4
                text-center
                text-[10px]
                sm:text-[10.5px]
                md:text-[11px]
                text-sbc-muted
              "
            >
              © {currentYear} Smart Business Corp — Tous droits réservés.
            </footer>

            <Analytics />
          </LangProvider>
        </Suspense>
      </body>
    </html>
  );
}
