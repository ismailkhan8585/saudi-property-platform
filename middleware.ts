import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isLogin = pathname === '/admin/login';
  const isProtected =
    (pathname.startsWith('/admin') && !isLogin) ||
    (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') ||
    (pathname.startsWith('/api/leads') && !(pathname === '/api/leads' && request.method === 'POST')) ||
    (pathname === '/api/settings' && request.method !== 'GET');

  const authenticated = await verifySessionToken(request.cookies.get('admin_session')?.value);

  if (isLogin && authenticated) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (isProtected && !authenticated) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/leads/:path*', '/api/settings'],
};
