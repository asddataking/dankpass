import { NextRequest, NextResponse } from 'next/server';

// Middleware simplified - all app routes now redirect at page level
// No auth checks needed since functionality moved to external app

export async function middleware(request: NextRequest) {
  // All protected routes are handled by page-level redirects
  // Admin routes can remain if needed, or redirect them as well
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Keep matcher empty or minimal - pages handle their own redirects
  ],
};
