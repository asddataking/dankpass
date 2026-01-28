'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { CONTACT_ANCHOR } from '@/lib/app-config';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'ROI', href: '#roi' },
  { label: 'Contact', href: '#contact' },
] as const;

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeAndScroll = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-card/80 backdrop-blur-md border-b border-brand-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Logo href="/" size="md" showText={true} />

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-brand-ink hover:text-brand-primary transition-colors font-medium text-sm"
              >
                {label}
              </Link>
            ))}
            <ThemeToggle />
            <Link
              href={CONTACT_ANCHOR}
              className="btn-primary px-4 sm:px-6 py-2 text-sm"
            >
              Book a Demo
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-ink hover:text-brand-primary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-brand-primary/10 pt-4">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="block text-brand-ink hover:text-brand-primary transition-colors font-medium py-2 text-base"
                onClick={closeAndScroll}
              >
                {label}
              </Link>
            ))}
            <Link
              href={CONTACT_ANCHOR}
              className="btn-primary w-full flex items-center justify-center mt-4 text-base py-3"
              onClick={closeAndScroll}
            >
              Book a Demo
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
