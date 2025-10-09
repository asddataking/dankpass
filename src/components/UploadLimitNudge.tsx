'use client';

import { motion } from 'framer-motion';
import { Crown, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface UploadLimitNudgeProps {
  receiptsUsed: number;
  receiptsLimit: number;
  isPremium: boolean;
}

export function UploadLimitNudge({ receiptsUsed, receiptsLimit, isPremium }: UploadLimitNudgeProps) {
  if (isPremium) return null;

  const remaining = receiptsLimit - receiptsUsed;
  const percentage = (receiptsUsed / receiptsLimit) * 100;
  const isNearLimit = receiptsUsed >= receiptsLimit * 0.8; // 80% threshold
  const isAtLimit = receiptsUsed >= receiptsLimit;

  if (!isNearLimit) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${
        isAtLimit 
          ? 'bg-gradient-to-r from-brand-error/10 to-brand-warn/10 border-brand-error/30' 
          : 'bg-gradient-to-r from-brand-warn/10 to-brand-primary/10 border-brand-warn/30'
      } mb-4`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 ${
          isAtLimit ? 'bg-brand-error' : 'bg-brand-warn'
        } rounded-xl flex items-center justify-center flex-shrink-0`}>
          {isAtLimit ? (
            <AlertCircle className="w-5 h-5 text-white" />
          ) : (
            <TrendingUp className="w-5 h-5 text-white" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-brand-ink mb-1">
            {isAtLimit ? '⚠️ Upload Limit Reached' : '📊 Almost at Your Limit'}
          </h3>
          <p className="text-sm text-brand-subtle mb-3">
            {isAtLimit 
              ? `You've used all ${receiptsLimit} receipts this month. Upgrade to Premium for unlimited uploads!`
              : `${remaining} receipt${remaining !== 1 ? 's' : ''} remaining this month (${receiptsUsed}/${receiptsLimit} used)`
            }
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-brand-bg rounded-full h-2 mb-3 overflow-hidden">
            <motion.div
              className={`h-full ${
                isAtLimit ? 'bg-brand-error' : 'bg-gradient-to-r from-brand-warn to-brand-primary'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Premium CTA */}
          <Link 
            href="/premium" 
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Premium for unlimited uploads & 1.5x points
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

