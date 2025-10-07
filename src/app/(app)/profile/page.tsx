'use client';

import { motion } from 'framer-motion';
import { User, Crown, Settings, LogOut, MapPin, Phone, Mail, Calendar, TrendingUp, Gift } from 'lucide-react';
import Link from 'next/link';
import { useUser, UserButton } from '@stackframe/stack';

export default function ProfilePage() {
  const user = useUser();
  
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
      color: 'dp-blue'
    },
    {
      label: 'Money Saved',
      value: `$${userStats.totalSaved}`,
      icon: Gift,
      color: 'dp-mint'
    },
    {
      label: 'Receipts',
      value: userStats.receiptsUploaded,
      icon: Calendar,
      color: 'dp-lime'
    },
    {
      label: 'Perks Used',
      value: userStats.perksRedeemed,
      icon: Crown,
      color: 'dp-blue'
    }
  ];

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
    <div className="min-h-screen bg-gradient-primary">
      <div className="px-6 pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-dp-blue-500 to-dp-blue-300 rounded-full mx-auto mb-4 flex items-center justify-center relative">
              <User className="w-12 h-12 text-white" />
              <div className="absolute bottom-0 right-0">
                <UserButton />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {userStats.firstName} {userStats.lastName}
            </h1>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-white/70">{userStats.tier} Member</span>
              {userStats.isPremium && (
                <Crown className="w-4 h-4 text-dp-blue-300" />
              )}
            </div>
            <p className="text-white/60">Member since {userStats.memberSince}</p>
          </div>

          {/* Premium CTA */}
          {!userStats.isPremium && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/premium" className="card bg-gradient-to-r from-dp-blue-500/20 to-dp-blue-600/20 border-dp-blue-500/30 block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-dp-blue-500/20 rounded-2xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-dp-blue-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Upgrade to Premium</h3>
                    <p className="text-sm text-white/70">Earn 1.5x points & unlock exclusive perks</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-dp-blue-300">$7/month</div>
                    <div className="text-xs text-white/60">Start free trial</div>
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
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-white/60">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Profile Information */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white/60" />
                <div>
                  <div className="text-sm text-white/60">Email</div>
                  <div className="text-white">{userStats.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-white/60" />
                <div>
                  <div className="text-sm text-white/60">Phone</div>
                  <div className="text-white">{userStats.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white/60" />
                <div>
                  <div className="text-sm text-white/60">Location</div>
                  <div className="text-white">{userStats.city}, {userStats.state}</div>
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
                  <Link href={item.href} className="card hover:bg-white/10 transition-colors flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white/70" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{item.label}</div>
                    </div>
                    <div className="text-white/40">›</div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Business Owner CTA */}
          <div className="card bg-gradient-to-r from-dp-mint/10 to-dp-lime/10 border-dp-mint/20 mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-dp-mint/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-dp-mint" />
              </div>
              <h3 className="font-semibold text-white mb-2">Own a Business?</h3>
              <p className="text-sm text-white/70 mb-4">
                Join our partner network and reach thousands of customers
              </p>
              <Link href="/join" className="btn-secondary">
                Become a Partner
              </Link>
            </div>
          </div>

          {/* Sign Out */}
          <motion.button
            className="w-full py-4 text-red-400 font-medium hover:bg-red-400/10 rounded-2xl transition-colors"
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
