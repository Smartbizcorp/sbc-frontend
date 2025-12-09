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
  const currentYear = new Date().getFullYear();

  return (
    <html lang="fr">
      <body className="min-h-screen bg-sbc-bg text-sbc-text flex flex-col">
        {/* HEADER GLOBAL (déjà géré en responsive dans ton composant Header) */}
        <Header />

        {/* CONTENU GLOBAL (pages publiques) */}
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

        {/* FOOTER GLOBAL */}
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
      </body>
    </html>
  );
}
