'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { isOnline, onConnectionChange } from '@/lib/offline';

export function OfflineIndicator() {
  const [online, setOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setOnline(isOnline());

    const cleanup = onConnectionChange((status) => {
      setOnline(status);
      setShowBanner(true);

      // Hide banner after 3 seconds if back online
      if (status) {
        setTimeout(() => setShowBanner(false), 3000);
      }
    });

    return cleanup;
  }, []);

  return (
    <AnimatePresence>
      {(!online || showBanner) && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 ${
            online ? 'bg-brand-success' : 'bg-orange-600'
          } text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2`}
        >
          {online ? (
            <>
              <Wifi className="w-4 h-4" />
              Back online! Your data is syncing...
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              You're offline. Viewing cached data.
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

