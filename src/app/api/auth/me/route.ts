import { NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { isAdminEmail, getOrCreateDbUser, userHasPremiumAccess } from '@/lib/auth';

export async function GET() {
  try {
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Get or create user in database
    const dbUser = await getOrCreateDbUser(user.id, user.primaryEmail || '');
    
    // Check if user is admin
    const isAdmin = isAdminEmail(user.primaryEmail);
    
    // Check if user has premium access
    const hasPremium = await userHasPremiumAccess(user.primaryEmail || '');

    return NextResponse.json({
      authenticated: true,
      id: user.id,
      email: user.primaryEmail,
      displayName: user.displayName,
      role: dbUser.role,
      isAdmin,
      isPremium: hasPremium,
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

