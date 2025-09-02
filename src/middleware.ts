import createMiddleware from 'next-intl/middleware';
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {locales, localePrefix} from './i18n';
 
const intlMiddleware = createMiddleware({
  locales,
  localePrefix,
  defaultLocale: 'en'
});

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const pathname = request.nextUrl.pathname;
  
  // Apply i18n
  const i18nResponse = intlMiddleware(request);

  // Handle protected admin routes
  const isAdminRoute = locales.some(locale => {
    const adminPath = `/${locale}/admin`;
    return pathname.startsWith(adminPath);
  });
  
  if (isAdminRoute) {
    if (!session) {
      const loginUrl = new URL(`/${pathname.split('/')[1]}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return i18nResponse;
}
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    '/',
    '/(en|hi)/:path*',
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ]
};