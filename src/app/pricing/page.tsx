'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Crown, Check, Zap, Shield, Star, Gift } from 'lucide-react';
import { APP_ROUTES } from '@/lib/app-config';

export default function PricingPage() {
  const benefits = [
    {
      icon: Zap,
      title: '1.5x Points',
      description: 'Earn 1.5x points on all purchases',
      color: 'dp-blue'
    },
    {
      icon: Crown,
      title: 'Premium Perks',
      description: 'Access to exclusive premium-only rewards',
      color: 'dp-mint'
    },
    {
      icon: Star,
      title: 'Priority Support',
      description: 'Get help faster with priority customer support',
      color: 'dp-lime'
    },
    {
      icon: Shield,
      title: 'Advanced Analytics',
      description: 'Track your spending and savings in detail',
      color: 'dp-blue'
    }
  ];

  const premiumPerks = [
    'VIP lounge access at select dispensaries',
    'Exclusive restaurant reservations',
    'Free delivery on orders over $30',
    'Early access to new partner offers',
    'Travel vouchers and experiences',
    'Premium customer support'
  ];

  return (
    <div className="min-h-screen bg-gradient-primary pb-24">
      <div className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-warn/20 text-brand-warn px-4 py-2 rounded-full border border-brand-warn/40 mb-4">
              <Crown className="w-4 h-4" />
              <span className="text-sm font-semibold">PREMIUM MEMBERSHIP</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-ink mb-4">
              Unlock 1.5x Points & VIP Perks
            </h1>
            <p className="text-lg text-brand-subtle max-w-2xl mx-auto">
              Get <span className="font-bold text-brand-primary">50% more points</span> on every upload, unlimited receipts, and exclusive rewards
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto mb-12">
            <div className="card bg-gradient-to-br from-brand-warn/20 to-brand-primary/20 border-brand-warn/30 text-center">
              <div className="py-8">
                <div className="mb-6">
                  <div className="text-5xl font-bold text-brand-ink mb-2">$7</div>
                  <div className="text-brand-subtle">per month</div>
                </div>
                <Link 
                  href={APP_ROUTES.PREMIUM}
                  className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
                >
                  <Crown className="w-5 h-5" />
                  Start Premium Trial
                </Link>
                <p className="text-sm text-brand-subtle">
                  Cancel anytime. No commitment required.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  className="card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-ink mb-1">{benefit.title}</h3>
                      <p className="text-sm text-brand-subtle">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Premium Perks List */}
          <div className="card mb-12">
            <h2 className="text-2xl font-bold text-brand-ink mb-6 text-center">Premium Perks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {premiumPerks.map((perk, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-brand-success mt-0.5 flex-shrink-0" />
                  <span className="text-brand-ink">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link 
              href={APP_ROUTES.PREMIUM}
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-lg"
            >
              <Crown className="w-5 h-5" />
              Upgrade to Premium - $7/month
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
