import { NextResponse, type NextRequest } from 'next/server';
import { parseAdminSession, SESSION_COOKIE_NAME } from '@/lib/auth';
 
export async function middleware(request: NextRequest) {
  const session = parseAdminSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);
 
  // If the user is trying to access the admin page without a session, redirect to login
  if (request.nextUrl.pathname.startsWith('/admin') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
 
  // If the user is logged in and tries to access the login page, redirect to admin
  if (request.nextUrl.pathname.startsWith('/login') && session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
 
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login/:path*'],
};
