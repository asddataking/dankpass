'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HapticFeedback } from '@/lib/haptics';

interface PointsAnimationProps {
  points: number;
  show: boolean;
  onComplete?: () => void;
}

export function PointsAnimation({ points, show, onComplete }: PointsAnimationProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      HapticFeedback.pointsEarned(points);
      
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, points, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: -50 }}
          exit={{ opacity: 0, scale: 0.8, y: -100 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: 2,
              ease: 'easeInOut',
            }}
            className="glass-card px-8 py-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.3 }}
              className="text-5xl font-bold text-brand-primary mb-2"
            >
              +{points}
            </motion.div>
            <div className="text-sm text-gray-300 font-medium">
              Points Earned! 🔥
            </div>
          </motion.div>
          
          {/* Confetti-like particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0.5],
                x: Math.cos((i / 8) * Math.PI * 2) * 100,
                y: Math.sin((i / 8) * Math.PI * 2) * 100,
              }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: 'easeOut',
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-brand-primary"
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

