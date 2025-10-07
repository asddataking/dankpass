'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gift, Camera, MapPin, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/perks', icon: Gift, label: 'Perks' },
  { href: '/upload', icon: Camera, label: 'Upload' },
  { href: '/', icon: MapPin, label: 'Explore' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-dp-dark/95 backdrop-blur-lg border-t border-white/10"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href === '/' && pathname === '/') ||
              (item.href === '/dashboard' && pathname.startsWith('/dashboard'));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 relative"
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-dp-blue-500/20 rounded-xl"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <Icon 
                    className={`w-5 h-5 mb-1 transition-colors ${
                      isActive ? 'text-dp-blue-300' : 'text-white/60'
                    }`} 
                  />
                  <span 
                    className={`text-xs font-medium transition-colors ${
                      isActive ? 'text-dp-blue-300' : 'text-white/60'
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
