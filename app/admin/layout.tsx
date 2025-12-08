import type { ReactNode } from "react";
import AdminNav from "./AdminNav";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="w-full mx-auto px-4 py-6 md:px-6 md:py-8 flex flex-col gap-6">
      {/* Menu admin commun */}
      <AdminNav />

      {/* Contenu des pages admin */}
      <div className="bg-sbc-bgSoft/40 border border-sbc-border rounded-3xl p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-lg">
        {children}
      </div>
    </div>
  );
}
