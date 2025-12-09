import type { ReactNode } from "react";
import AdminNav from "./AdminNav";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-sbc-bg text-sbc-text overflow-x-hidden">
      {/* Conteneur centré qui s'adapte : full-width sur mobile, max-width sur grand écran */}
      <div className="mx-auto w-full max-w-full sm:max-w-3xl lg:max-w-5xl 2xl:max-w-6xl px-3 sm:px-4 md:px-6 py-4 md:py-8 flex flex-col gap-4 md:gap-6">
        {/* Barre admin : en haut, adaptée mobile/desktop */}
        <header className="sticky top-0 z-20 bg-sbc-bg/85 backdrop-blur-md border-b border-sbc-border/40 px-1 py-2 md:px-0 md:py-0 md:border-none md:bg-transparent md:backdrop-blur-0">
          <AdminNav />
        </header>

        {/* Contenu des pages admin */}
        <main className="flex-1">
          <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-3 sm:p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
