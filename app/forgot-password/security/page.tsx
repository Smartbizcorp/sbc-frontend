// app/forgot-password/security/page.tsx
import { Suspense } from "react";
import ForgotPasswordSecurityClient from "./ForgotPasswordSecurityClient";

export default function ForgotPasswordSecurityPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto bg-sbc-bgSoft/60 border border-sbc-border rounded-3xl p-8 text-sm text-sbc-muted">
          Chargement de la vérification de sécurité...
        </div>
      }
    >
      <ForgotPasswordSecurityClient />
    </Suspense>
  );
}
