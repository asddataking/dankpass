'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SignUp } from '@stackframe/stack';
import { Logo } from '@/components/Logo';

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

          {/* Stack Auth Sign Up Component */}
          <div className="max-w-md mx-auto">
            <SignUp />
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
