'use client';

import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';
import { OfflineIndicator } from '@/components/OfflineIndicator';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <OfflineIndicator />
      {/* Main Content */}
      <motion.main 
        className="flex-1 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
