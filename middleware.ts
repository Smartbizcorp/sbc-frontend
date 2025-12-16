import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["fr", "en", "es", "pt", "ar"] as const;
const DEFAULT = "fr";
const COOKIE_KEY = "sbc_locale";

function pickFromAcceptLanguage(header: string | null) {
  const h = (header || "").toLowerCase();
  const found = LOCALES.find((l) => h.includes(l));
  return found || DEFAULT;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ignore assets / api
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // si ?lang=xx on le garde (provider client s'en chargera)
  const url = req.nextUrl.clone();
  const qLang = url.searchParams.get("lang")?.toLowerCase();
  if (qLang && LOCALES.includes(qLang as any)) {
    const res = NextResponse.next();
    res.cookies.set(COOKIE_KEY, qLang, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  // si cookie déjà présent -> ok
  const cookie = req.cookies.get(COOKIE_KEY)?.value?.toLowerCase();
  if (cookie && LOCALES.includes(cookie as any)) return NextResponse.next();

  // sinon on détecte et on set le cookie (sans rediriger)
  const preferred = pickFromAcceptLanguage(req.headers.get("accept-language"));
  const res = NextResponse.next();
  res.cookies.set(COOKIE_KEY, preferred, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
  return res;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
