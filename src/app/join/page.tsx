'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, Users, TrendingUp, Shield } from 'lucide-react';

export default function JoinPage() {
  const partnerTypes = [
    {
      type: 'dispensary',
      title: 'Dispensary Owner',
      description: 'Cannabis retailers and dispensaries',
      icon: MapPin,
      color: 'dp-mint',
      benefits: [
        'Reach thousands of cannabis consumers',
        'Increase customer loyalty and retention',
        'Track sales and customer analytics',
        'Easy redemption management'
      ]
    },
    {
      type: 'restaurant',
      title: 'Restaurant Owner',
      description: 'Restaurants, cafes, and food establishments',
      icon: Star,
      color: 'dp-lime',
      benefits: [
        'Attract new customers to your restaurant',
        'Boost repeat visits and loyalty',
        'Competitive advantage in your area',
        'Simple point redemption system'
      ]
    }
  ];

  const stats = [
    { label: 'Active Partners', value: '500+', icon: Users },
    { label: 'Customer Reach', value: '50K+', icon: TrendingUp },
    { label: 'Secure Platform', value: '99.9%', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="px-6 pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            
            <h1 className="text-3xl font-bold text-white mb-4">Join Our Partner Network</h1>
            <p className="text-white/70 max-w-md mx-auto">
              Connect with thousands of customers and grow your business with DankPass
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="text-2xl font-bold text-dp-blue-300 mb-1">{stat.value}</div>
                  <div className="text-xs text-white/60">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Partner Types */}
          <div className="space-y-6 mb-8">
            {partnerTypes.map((partner, index) => {
              const Icon = partner.icon;
              return (
                <motion.div
                  key={partner.type}
                  className="card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 bg-${partner.color}-500/20 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${partner.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">{partner.title}</h3>
                      <p className="text-white/70">{partner.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-white mb-3">Benefits:</h4>
                    <ul className="space-y-2">
                      {partner.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-dp-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-white/70">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link 
                    href={`/join/${partner.type}`}
                    className="btn-primary w-full text-center block"
                  >
                    Join as {partner.title}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Customer Option */}
          <motion.div
            className="card bg-gradient-to-r from-dp-blue-500/10 to-dp-blue-600/10 border-dp-blue-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-dp-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-dp-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">I&apos;m a Customer</h3>
              <p className="text-white/70 mb-6">
                Looking to earn points and get perks? Join as a customer and start earning rewards today.
              </p>
              <Link href="/auth/signup" className="btn-secondary">
                Sign Up as Customer
              </Link>
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div className="card">
                <h4 className="font-medium text-white mb-2">How much does it cost to join?</h4>
                <p className="text-sm text-white/70">
                  Joining the DankPass partner network is completely free. We only take a small commission when customers redeem points at your business.
                </p>
              </div>
              <div className="card">
                <h4 className="font-medium text-white mb-2">How do customers redeem points?</h4>
                <p className="text-sm text-white/70">
                  Customers can redeem points for discounts and perks directly through the app. You&apos;ll receive notifications and can track all redemptions in your partner dashboard.
                </p>
              </div>
              <div className="card">
                <h4 className="font-medium text-white mb-2">How long does approval take?</h4>
                <p className="text-sm text-white/70">
                  Most applications are reviewed and approved within 2-3 business days. We&apos;ll notify you via email once your application is approved.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
