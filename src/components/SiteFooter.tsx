'use client';

import Link from 'next/link';
import { ECOSYSTEM_LINKS } from '@/lib/app-config';

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-primary/10 bg-brand-card/50 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-brand-ink mb-4">DankPass</h3>
            <p className="text-brand-subtle mb-4">
              Earn free weed with every receipt. Upload receipts from dispensaries & restaurants to earn points and burn for rewards.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-brand-ink mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="text-brand-subtle hover:text-brand-primary transition-colors">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-brand-subtle hover:text-brand-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-brand-subtle hover:text-brand-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem */}
          <div>
            <h4 className="font-semibold text-brand-ink mb-4">Ecosystem</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href={ECOSYSTEM_LINKS.DAILY_DISPODEALS} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-subtle hover:text-brand-primary transition-colors"
                >
                  Daily Dispo Deals
                </Link>
              </li>
              <li>
                <Link 
                  href={ECOSYSTEM_LINKS.DANKNDEVOUR} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-subtle hover:text-brand-primary transition-colors"
                >
                  Dank N Devour
                </Link>
              </li>
              <li>
                <Link 
                  href={ECOSYSTEM_LINKS.DANK_NETWORK} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-subtle hover:text-brand-primary transition-colors"
                >
                  The Dank Network
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-brand-primary/10 text-center text-sm text-brand-subtle">
          <p>© {new Date().getFullYear()} DankPass. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
