'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gift, Camera, MapPin, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { APP_ROUTES } from '@/lib/app-config';

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { href: APP_ROUTES.DASHBOARD, icon: Home, label: 'Home' },
    { href: APP_ROUTES.PERKS, icon: Gift, label: 'Burn' },
    { href: APP_ROUTES.UPLOAD, icon: Camera, label: 'Earn' },
    { href: '/', icon: MapPin, label: 'Explore' },
    { href: APP_ROUTES.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-brand-ink/10 rounded-t-2xl"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Only show active state for internal routes (like '/')
            const isActive = item.href === '/' && pathname === '/';
            
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={item.href.startsWith('/')}
                className="flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 relative"
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-brand-primary/10 rounded-xl"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <Icon 
                    className={`w-5 h-5 mb-1 transition-colors ${
                      isActive ? 'text-brand-primary' : 'text-brand-subtle'
                    }`} 
                  />
                  <span 
                    className={`text-xs font-medium transition-colors ${
                      isActive ? 'text-brand-primary' : 'text-brand-subtle'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
