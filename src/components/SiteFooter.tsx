'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { ECOSYSTEM_LINKS, CONTACT_ANCHOR } from '@/lib/app-config';

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-primary/10 bg-brand-card/50 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col items-center text-center gap-6">
          <Logo href="/" size="md" showText={true} />
          <p className="text-brand-subtle text-sm max-w-md">
            Loyalty-as-a-Service for Dispensaries
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href={ECOSYSTEM_LINKS.DAILY_DISPODEALS}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-subtle hover:text-brand-primary transition-colors"
            >
              Daily Dispo Deals
            </Link>
            <Link
              href={CONTACT_ANCHOR}
              className="text-brand-subtle hover:text-brand-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-brand-primary/10 text-center text-sm text-brand-subtle">
          <p>© {new Date().getFullYear()} DankPass. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
