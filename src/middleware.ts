import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from './stack';

// Admin user email
const ADMIN_EMAIL = 'daniel.richmond.ebert@gmail.com';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    try {
      const user = await stackServerApp.getUser();
      
      if (!user) {
        // Redirect to sign in if not authenticated
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }

      // Check if user is admin
      const isAdmin = user.primaryEmail === ADMIN_EMAIL;
      
      if (!isAdmin) {
        // Redirect non-admin users to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  // Protect authenticated routes (dashboard, profile, upload, perks, premium)
  const protectedRoutes = ['/dashboard', '/profile', '/upload', '/perks', '/premium'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    try {
      const user = await stackServerApp.getUser();
      
      if (!user) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
      }
      
      return NextResponse.next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/upload/:path*',
    '/perks/:path*',
    '/premium/:path*',
  ],
};
