import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // This is a simple mock authentication check
  const isAuthenticated = request.cookies.get('auth_logged_in');
  const isAdmin = request.cookies.get('admin_mode');

  if (path.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!isAdmin) {
       return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Redirect admins from root to dashboard by default
  if (path === '/') {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*', '/checkout/:path*'],
};
