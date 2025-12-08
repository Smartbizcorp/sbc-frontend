// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Smart Business Corp",
  description: "Plateforme d'investissement",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-sbc-bg text-sbc-text flex flex-col">
        {/* HEADER GLOBAL */}
        <Header />

        {/* CONTENU GLOBAL (pages publiques) */}
        <main className="flex-1 px-4 py-4 sm:px-6 md:px-10 lg:px-16">
          {/* 🔽 on resserre la largeur max ici */}
          <div className="w-full max-w-5xl mx-auto">
            {children}
          </div>
        </main>

        {/* FOOTER GLOBAL */}
        <footer className="border-t border-sbc-border py-3 md:py-4 px-4 text-center text-[10px] md:text-[11px] text-sbc-muted">
          © {new Date().getFullYear()} Smart Business Corp — Tous droits réservés.
        </footer>
      </body>
    </html>
  );
}
