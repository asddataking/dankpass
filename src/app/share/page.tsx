'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ShareHandlerPage() {
  const router = useRouter();

  useEffect(() => {
    // Marketing site: all shared links go to home
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="muted">Processing shared content…</p>
      </div>
    </div>
  );
}


