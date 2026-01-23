'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { APP_ROUTES } from '@/lib/app-config';

export default function SignUpPage() {
  return (
    <div className="min-h-screen">
      <div className="px-6 pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-brand-subtle hover:text-brand-ink mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            
            <div className="flex justify-center mb-6">
              <Logo size="lg" showText={true} />
            </div>
            
            <h1 className="text-3xl font-bold text-brand-ink mb-2">Create account</h1>
            <p className="muted">Join DankPass and start earning points</p>
          </div>

          {/* CTA Button */}
          <div className="max-w-md mx-auto">
            <Link 
              href={APP_ROUTES.SIGNIN}
              className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4"
            >
              <UserPlus className="w-5 h-5" />
              Sign Up / Create Account
            </Link>
            <p className="text-center text-sm text-brand-subtle mt-4">
              You&apos;ll be redirected to the DankPass app to create your account
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="muted">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-brand-primary hover:text-brand-primary/80 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
