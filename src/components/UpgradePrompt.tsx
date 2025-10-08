'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Sparkles, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UpgradePromptProps {
  show: boolean;
  onClose: () => void;
  pointsEarned?: number;
}

export function UpgradePrompt({ show, onClose, pointsEarned = 10 }: UpgradePromptProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);

  const handleUpgrade = () => {
    router.push('/premium');
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const potentialBonusPoints = Math.floor(pointsEarned * 0.5);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="card max-w-md w-full relative">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-brand-subtle hover:text-brand-ink transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <Crown className="w-8 h-8 text-white" />
                </motion.div>

                <h2 className="text-2xl font-bold text-brand-ink mb-2">
                  Great First Upload! 🎉
                </h2>
                <p className="text-brand-subtle">
                  You earned {pointsEarned} points. Nice start!
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-brand-primary/10 to-brand-success/10 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-ink mb-1">
                      Unlock Premium
                    </h3>
                    <p className="text-sm text-brand-subtle">
                      Earn 1.5x points on every upload. You could have earned <span className="font-semibold text-brand-success">{potentialBonusPoints} bonus points</span> on this upload!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brand-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-brand-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-ink mb-1">
                      Plus Premium Perks
                    </h3>
                    <ul className="text-sm text-brand-subtle space-y-1">
                      <li>• Exclusive rewards & offers</li>
                      <li>• Priority support</li>
                      <li>• Points never expire</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-brand-bg rounded-xl p-4 mb-6 text-center">
                <div className="text-sm text-brand-subtle mb-1">Starting at</div>
                <div className="text-3xl font-bold text-brand-ink">
                  $7<span className="text-lg text-brand-subtle">/month</span>
                </div>
                <div className="text-xs text-brand-subtle mt-1">Cancel anytime</div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleUpgrade}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Upgrade to Premium
                </button>
                <button
                  onClick={handleClose}
                  className="btn-ghost w-full"
                >
                  Maybe Later
                </button>
              </div>

              {/* Fine Print */}
              <p className="text-xs text-center text-brand-subtle mt-4">
                30-day money-back guarantee. No questions asked.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

