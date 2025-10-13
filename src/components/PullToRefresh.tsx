'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const { isRefreshing, pullDistance, progress } = usePullToRefresh({
    onRefresh,
    threshold: 80,
  });

  return (
    <div className="relative">
      <AnimatePresence>
        {(pullDistance > 0 || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: Math.max(pullDistance, isRefreshing ? 60 : 0) 
            }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-gradient-to-b from-brand-primary/20 to-transparent"
            style={{
              height: `${Math.max(pullDistance, isRefreshing ? 60 : 0)}px`,
            }}
          >
            <motion.div
              animate={{
                rotate: isRefreshing ? 360 : progress * 3.6,
              }}
              transition={
                isRefreshing
                  ? {
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }
                  : { duration: 0 }
              }
              className="relative"
            >
              <RefreshCw
                className={`w-6 h-6 ${
                  isRefreshing ? 'text-brand-primary' : 'text-gray-400'
                }`}
              />
              {!isRefreshing && (
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-brand-primary"
                    strokeDasharray={`${(progress / 100) * 62.83} 62.83`}
                    opacity={progress / 100}
                  />
                </svg>
              )}
            </motion.div>
            {!isRefreshing && progress >= 100 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-2 text-xs text-brand-primary font-medium"
              >
                Release to refresh
              </motion.p>
            )}
            {isRefreshing && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-2 text-xs text-brand-primary font-medium"
              >
                Refreshing...
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

