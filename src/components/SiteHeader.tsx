'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { APP_ROUTES } from '@/lib/app-config';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-card/80 backdrop-blur-md border-b border-brand-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo href="/" size="md" showText={true} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/how-it-works" className="text-brand-ink hover:text-brand-primary transition-colors font-medium text-sm">
              How it Works
            </Link>
            <Link href="/pricing" className="text-brand-ink hover:text-brand-primary transition-colors font-medium text-sm">
              Pricing
            </Link>
            <Link href="/faq" className="text-brand-ink hover:text-brand-primary transition-colors font-medium text-sm">
              FAQ
            </Link>
            <ThemeToggle />
            <Link 
              href={APP_ROUTES.LAUNCH}
              className="btn-primary px-4 sm:px-6 py-2 text-sm"
            >
              Launch App
            </Link>
          </nav>

          {/* Mobile Right Side */}
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-brand-primary/10 pt-4">
            <Link 
              href="/how-it-works" 
              className="block text-brand-ink hover:text-brand-primary transition-colors font-medium py-2 text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            <Link 
              href="/pricing" 
              className="block text-brand-ink hover:text-brand-primary transition-colors font-medium py-2 text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/faq" 
              className="block text-brand-ink hover:text-brand-primary transition-colors font-medium py-2 text-base"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link 
              href={APP_ROUTES.LAUNCH}
              className="btn-primary w-full flex items-center justify-center mt-4 text-base py-3"
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
