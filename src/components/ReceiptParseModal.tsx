'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, TrendingUp, Calendar, DollarSign, Store } from 'lucide-react';

interface ReceiptParseModalProps {
  show: boolean;
  onClose: () => void;
  data?: {
    merchant?: string | null;
    purchase_date?: string | null;
    total: number;
    pointsAwarded: number;
  };
}

export function ReceiptParseModal({ show, onClose, data }: ReceiptParseModalProps) {
  if (!data) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="card max-w-sm w-full pointer-events-auto relative"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-brand-subtle hover:text-brand-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Success Icon */}
              <div className="text-center mb-6">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-brand-success to-brand-success/80 rounded-full mx-auto mb-4 flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-brand-ink mb-1">🔥 Receipt Analyzed!</h3>
                <p className="text-sm text-brand-subtle">Points earned and ready to burn</p>
              </div>

              {/* Receipt Details */}
              <div className="space-y-3 mb-6">
                {data.merchant && (
                  <div className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl">
                    <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                      <Store className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-brand-subtle">Merchant</p>
                      <p className="font-medium text-brand-ink">{data.merchant}</p>
                    </div>
                  </div>
                )}

                {data.purchase_date && (
                  <div className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl">
                    <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-brand-subtle">Date</p>
                      <p className="font-medium text-brand-ink">
                        {new Date(data.purchase_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-brand-subtle">Total</p>
                    <p className="font-medium text-brand-ink">${data.total.toFixed(2)}</p>
                  </div>
                </div>

                {/* Points Earned - Highlighted */}
                <motion.div
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-brand-success/20 to-brand-warn/20 rounded-xl border-2 border-brand-success/30"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', damping: 15 }}
                >
                  <div className="w-10 h-10 bg-brand-success rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-brand-subtle">Points Earned</p>
                    <p className="text-2xl font-bold text-brand-success">
                      +{data.pointsAwarded.toLocaleString()} pts
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={onClose}
                  className="btn-primary w-full"
                >
                  Awesome! 🔥
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 text-sm text-brand-subtle hover:text-brand-ink transition-colors"
                >
                  Upload Another Receipt
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

