import { NextResponse } from "next/server";

const locales = ["en", "en-US", "es", "fr", "nl-NL"];
const defaultLocale = "en";
const protectedRoutes = ["/user", "/order", "/checkout"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip internal and static asset paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  const pathnameParts = pathname.split("/");

  // Detect locale
  const currentLocale = locales.includes(pathnameParts[1])
    ? pathnameParts[1]
    : defaultLocale;

  // Extract path after locale (example: /en/user/orders -> /user/orders)
  const pathAfterLocale = locales.includes(pathnameParts[1])
    ? `/${pathnameParts.slice(2).join("/")}`
    : pathname;

  // Check if route should be considered protected (but do nothing now)
  const isProtected = protectedRoutes.some((route) =>
    pathAfterLocale.startsWith(route)
  );

  // 🚫 No auth redirect / cookie validation anymore
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|images).*)"],
};
