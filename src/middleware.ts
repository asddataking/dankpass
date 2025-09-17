import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';

export async function middleware(request: NextRequest) {
  const user = await stackServerApp.getUser();
  
  // Protect passport and admin routes
  if (request.nextUrl.pathname.startsWith('/passport') || 
      request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/handler/sign-in', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/passport/:path*', '/admin/:path*'],
};
