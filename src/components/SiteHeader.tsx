'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { APP_ROUTES } from '@/lib/app-config';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-card/80 backdrop-blur-md border-b border-brand-primary/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo href="/" size="md" showText={true} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/how-it-works" className="text-brand-ink hover:text-brand-primary transition-colors font-medium">
              How it Works
            </Link>
            <Link href="/pricing" className="text-brand-ink hover:text-brand-primary transition-colors font-medium">
              Pricing
            </Link>
            <Link href="/faq" className="text-brand-ink hover:text-brand-primary transition-colors font-medium">
              FAQ
            </Link>
            <Link 
              href={APP_ROUTES.LAUNCH}
              className="btn-primary px-6 py-2 text-base"
            >
              Launch App
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-brand-ink hover:text-brand-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-brand-primary/10 pt-4">
            <Link 
              href="/how-it-works" 
              className="block text-brand-ink hover:text-brand-primary transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link 
              href="/pricing" 
              className="block text-brand-ink hover:text-brand-primary transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/faq" 
              className="block text-brand-ink hover:text-brand-primary transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link 
              href={APP_ROUTES.LAUNCH}
              className="btn-primary w-full flex items-center justify-center mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Launch App
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
