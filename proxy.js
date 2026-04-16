import { NextResponse } from 'next/server';

let locales = ['en', 'ja', 'zh', 'es', 'fr'];
let defaultLocale = 'en';

export function proxy(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
 
  if (pathnameHasLocale) return;
 
  // Redirect if there is no locale
  // e.g. incoming request is /search
  // The new URL is now /en/search
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}
 
export const config = {
  matcher: [
    // Skip all internal paths (_next), API routes, and static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
