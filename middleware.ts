import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_req: NextRequest) {
  // ✅ Pas de réécriture d'URL / pas de /en/... /es/... etc.
  // La langue est gérée côté client (cookie/localStorage) + hook de traduction.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
