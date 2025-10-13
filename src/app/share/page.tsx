'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ShareHandlerPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const url = params.get('url') || '';
    const text = params.get('text') || '';
    const title = params.get('title') || '';

    // Basic routing logic for shared content
    if (url) {
      try {
        const u = new URL(url);
        if (u.hostname.includes('dankpass')) {
          router.replace(u.pathname + u.search + u.hash);
          return;
        }
      } catch {}
    }

    // If it looks like a perks link in text, try to route
    const match = /\/perks\/(\w+)/.exec(text || url || '');
    if (match) {
      router.replace(`/perks/${match[1]}`);
      return;
    }

    // Default: take the user to upload screen; preserve context in query
    const q = new URLSearchParams();
    if (url) q.set('sharedUrl', url);
    if (text) q.set('sharedText', text);
    if (title) q.set('sharedTitle', title);
    router.replace(`/upload?${q.toString()}`);
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="muted">Processing shared content…</p>
      </div>
    </div>
  );
}


