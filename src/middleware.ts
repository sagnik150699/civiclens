import { NextResponse, type NextRequest } from 'next/server'
 
export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
 
  // If the user is trying to access the admin page without a session, redirect to login
  if (request.nextUrl.pathname.startsWith('/admin') && !session?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
 
  // If the user is logged in and tries to access the login page, redirect to admin
  if (request.nextUrl.pathname.startsWith('/login') && session?.value) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
 
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login/:path*'],
}
