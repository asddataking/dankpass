'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard where upload functionality now lives
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-brand-subtle">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
