import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["fr", "en", "es", "ar"];
const DEFAULT = "fr";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ignore assets/api
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // déjà préfixé langue
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  // détection simple via header navigateur
  const accept = req.headers.get("accept-language") || "";
  const preferred = LOCALES.find((l) => accept.toLowerCase().includes(l)) || DEFAULT;

  const url = req.nextUrl.clone();
  url.pathname = `/${preferred}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
