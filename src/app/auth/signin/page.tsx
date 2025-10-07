'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SignIn } from '@stackframe/stack';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="px-6 pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-white/70">Sign in to your DankPass account</p>
          </div>

          {/* Stack Auth Sign In Component */}
          <div className="max-w-md mx-auto">
            <SignIn />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/70">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-dp-blue-300 hover:text-dp-blue-200 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
