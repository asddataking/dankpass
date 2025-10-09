'use client';

import { useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { useRouter } from 'next/navigation';
import { isSessionExpired, updateLastActivity, clearSessionActivity, initActivityTracking } from '@/lib/sessionTimeout';

export function SessionCheck() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only check for authenticated users
    if (!user) {
      clearSessionActivity();
      return;
    }

    // Check if session has expired due to inactivity
    if (isSessionExpired()) {
      console.log('Session expired due to inactivity. Signing out...');
      clearSessionActivity();
      user.signOut().then(() => {
        router.push('/');
      });
      return;
    }

    // Initialize activity tracking
    initActivityTracking();

    // Check session expiry periodically (every 30 seconds)
    const interval = setInterval(() => {
      if (isSessionExpired()) {
        console.log('Session expired due to inactivity. Signing out...');
        clearSessionActivity();
        user.signOut().then(() => {
          router.push('/');
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user, router]);

  // This component doesn't render anything
  return null;
}

