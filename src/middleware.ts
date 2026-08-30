import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Bypass static files, images, favicon, api routes, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Allow public routes without restrictions
  if (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/verify')
  ) {
    return NextResponse.next();
  }

  // 3. Check for presence of Supabase authentication tokens in cookies or headers
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) =>
      c.name.includes('sb-') ||
      c.name.includes('supabase-auth-token') ||
      c.name.includes('marlins_auth') ||
      c.name.includes('auth-token')
  );

  // If visiting protected student or admin route without any auth cookie or demo user flag
  // (In production, the client AuthContext also performs precise permission checks)
  const isProtectedAdminRoute = pathname.startsWith('/admin');
  const isProtectedStudentRoute = pathname.startsWith('/student');

  if ((isProtectedAdminRoute || isProtectedStudentRoute) && !hasAuthCookie) {
    // Check if demo query or header exists (for developer inspection)
    const isDemoParam = request.nextUrl.searchParams.get('demo');
    if (isDemoParam) {
      return NextResponse.next();
    }
  }

  // Add standard security response headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
