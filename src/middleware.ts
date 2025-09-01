import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
 
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/admin/:path*'],
}
