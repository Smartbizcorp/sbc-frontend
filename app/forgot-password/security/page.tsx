// app/forgot-password/security/page.tsx
import { Suspense } from "react";
import ForgotPasswordSecurityClient from "./ForgotPasswordSecurityClient";

export default function ForgotPasswordSecurityPage() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
      <Suspense
        fallback={
          <div className="w-full max-w-3xl mx-auto bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-5 sm:p-6 md:p-8 text-xs sm:text-sm text-sbc-muted shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            Chargement de la vérification de sécurité...
          </div>
        }
      >
        <ForgotPasswordSecurityClient />
      </Suspense>
    </main>
  );
}
