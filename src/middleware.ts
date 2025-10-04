import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'

const isProtectedRoute = (pathname: string): boolean => {
  const protectedRoutes = [
    '/me',
    '/upload',
    '/rewards',
    '/admin',
    '/api/upload',
    '/api/redeem',
    '/api/me',
    '/api/admin'
  ]
  
  return protectedRoutes.some(route => pathname.startsWith(route))
}

const isAdminRoute = (pathname: string): boolean => {
  const adminRoutes = ['/admin', '/api/admin']
  return adminRoutes.some(route => pathname.startsWith(route))
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isProtectedRoute(pathname)) {
    try {
      const user = await stackServerApp.getUser()
      if (!user) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
      }

      // Check admin routes
      if (isAdminRoute(pathname)) {
        const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
        // TODO: Get email from Stack Auth when available
        // For now, allow access for development
        console.log('Admin route accessed - auth check disabled for development')
      }
    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
