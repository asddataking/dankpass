import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from './stack';

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

      // Check if user is admin (you might need to implement role checking)
      // For now, we'll allow any authenticated user to access admin
      // In production, you should check user roles from your database
      
      return NextResponse.next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  // Protect app routes (dashboard, profile, etc.)
  if (pathname.startsWith('/(app)')) {
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
    '/(app)/:path*',
  ],
};
