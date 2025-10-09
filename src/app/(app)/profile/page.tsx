'use client';

import { motion } from 'framer-motion';
import { User, Crown, Settings, LogOut, MapPin, Phone, Mail, Calendar, TrendingUp, Gift } from 'lucide-react';
import Link from 'next/link';
import { useUser, UserButton } from '@stackframe/stack';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const user = useUser();
  const router = useRouter();
  
  // Mock user data - in real app, this would come from the database
  const userStats = {
    firstName: user?.displayName?.split(' ')[0] || 'User',
    lastName: user?.displayName?.split(' ')[1] || '',
    email: user?.primaryEmail || 'user@example.com',
    phone: '+1 (555) 123-4567',
    city: 'San Francisco',
    state: 'CA',
    memberSince: 'January 2024',
    tier: 'Gold',
    isPremium: false,
    totalPoints: 1250,
    totalSaved: 89.50,
    receiptsUploaded: 12,
    perksRedeemed: 3
  };

  const stats = [
    {
      label: 'Total Points',
      value: userStats.totalPoints.toLocaleString(),
      icon: TrendingUp,
      color: 'brand-primary'
    },
    {
      label: 'Money Saved',
      value: `$${userStats.totalSaved}`,
      icon: Gift,
      color: 'brand-success'
    },
    {
      label: 'Receipts',
      value: userStats.receiptsUploaded,
      icon: Calendar,
      color: 'brand-warn'
    },
    {
      label: 'Perks Used',
      value: userStats.perksRedeemed,
      icon: Crown,
      color: 'brand-primary'
    }
  ];

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await user?.signOut();
        // Redirect to home page after sign out
        window.location.href = '/';
      } catch (error) {
        console.error('Error signing out:', error);
        // Still redirect even if there's an error
        window.location.href = '/';
      }
    }
  };

  const menuItems = [
    {
      label: 'Account Settings',
      icon: Settings,
      href: '/settings'
    },
    {
      label: 'Payment Methods',
      icon: Crown,
      href: '/payment'
    },
    {
      label: 'Refer Friends',
      icon: User,
      href: '/refer'
    },
    {
      label: 'Help & Support',
      icon: Phone,
      href: '/support'
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="px-6 pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-full mx-auto mb-4 flex items-center justify-center relative">
              <User className="w-12 h-12 text-white" />
              <div className="absolute bottom-0 right-0">
                <UserButton />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-brand-ink mb-1">
              {userStats.firstName} {userStats.lastName}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="muted">{userStats.tier} Member</span>
              {userStats.isPremium && (
                <Crown className="w-4 h-4 text-brand-primary" />
              )}
            </div>
            <p className="text-brand-subtle">Member since {userStats.memberSince}</p>
          </div>

          {/* Premium CTA */}
          {!userStats.isPremium && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/premium" className="card bg-gradient-to-r from-brand-primary/10 to-brand-primary/20 border-brand-primary/30 block hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-ink mb-1">Upgrade to Premium</h3>
                    <p className="muted">Earn 1.5x points & unlock exclusive perks</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-brand-primary">$7/month</div>
                    <div className="muted">Start free trial</div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${stat.color}/10 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-brand-ink">{stat.value}</div>
                      <div className="muted">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Profile Information */}
          <div className="card mb-6 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
            <h3 className="text-lg font-semibold text-brand-ink mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-subtle" />
                <div>
                  <div className="muted">Email</div>
                  <div className="text-brand-ink">{userStats.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-subtle" />
                <div>
                  <div className="muted">Phone</div>
                  <div className="text-brand-ink">{userStats.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-brand-subtle" />
                <div>
                  <div className="muted">Location</div>
                  <div className="text-brand-ink">{userStats.city}, {userStats.state}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-2 mb-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link href={item.href} className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-subtle" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-brand-ink">{item.label}</div>
                    </div>
                    <div className="text-brand-subtle">›</div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Business Owner CTA */}
          <div className="card bg-gradient-to-r from-brand-success/10 to-brand-warn/10 border-brand-success/20 mb-6 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-success/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-brand-success" />
              </div>
              <h3 className="font-semibold text-brand-ink mb-2">Own a Business?</h3>
              <p className="muted mb-4">
                Join our partner network and reach thousands of customers
              </p>
              <Link href="/join" className="btn-ghost">
                Become a Partner
              </Link>
            </div>
          </div>

          {/* Sign Out */}
          <motion.button
            onClick={handleSignOut}
            className="w-full py-4 text-brand-error font-medium hover:bg-brand-error/10 rounded-2xl transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5" />
              Sign Out
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
