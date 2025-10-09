'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Gift, Camera, MapPin, User, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@stackframe/stack';
import { useState, useEffect } from 'react';

export default function BottomNavigation() {
  const pathname = usePathname();
  const user = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin || false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    }

    checkAdmin();
  }, [user]);

  const baseNavItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/perks', icon: Gift, label: 'Perks' },
    { href: '/upload', icon: Camera, label: 'Upload' },
    { href: '/', icon: MapPin, label: 'Explore' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  // Add admin link for admin users
  const navItems = isAdmin 
    ? [
        { href: '/dashboard', icon: Home, label: 'Home' },
        { href: '/perks', icon: Gift, label: 'Perks' },
        { href: '/upload', icon: Camera, label: 'Upload' },
        { href: '/admin', icon: Shield, label: 'Admin' },
        { href: '/profile', icon: User, label: 'Profile' },
      ]
    : baseNavItems;

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
            const isActive = pathname === item.href || 
              (item.href === '/' && pathname === '/') ||
              (item.href === '/dashboard' && pathname.startsWith('/dashboard')) ||
              (item.href === '/admin' && pathname.startsWith('/admin'));
            
            return (
              <Link
                key={item.href}
                href={item.href}
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
