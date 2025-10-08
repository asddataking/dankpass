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
    <div className="min-h-screen">
      <div className="px-6 pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-brand-subtle hover:text-brand-ink mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
            
            <h1 className="text-3xl font-bold text-brand-ink mb-4">Join Our Partner Network</h1>
            <p className="muted max-w-md mx-auto">
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
                  <div className="text-2xl font-bold text-brand-primary mb-1">{stat.value}</div>
                  <div className="muted">{stat.label}</div>
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
                  className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 bg-${partner.color === 'dp-mint' ? 'brand-success' : 'brand-warn'}/10 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${partner.color === 'dp-mint' ? 'brand-success' : 'brand-warn'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-brand-ink mb-2">{partner.title}</h3>
                      <p className="muted">{partner.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-brand-ink mb-3">Benefits:</h4>
                    <ul className="space-y-2">
                      {partner.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="muted">{benefit}</span>
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
            className="card bg-gradient-to-r from-brand-primary/10 to-brand-primary/20 border-brand-primary/20 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold text-brand-ink mb-2">I&apos;m a Customer</h3>
              <p className="muted mb-6">
                Looking to earn points and get perks? Join as a customer and start earning rewards today.
              </p>
              <Link href="/auth/signup" className="btn-ghost">
                Sign Up as Customer
              </Link>
            </div>
          </motion.div>

          {/* FAQ */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-brand-ink mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
                <h4 className="font-medium text-brand-ink mb-2">How much does it cost to join?</h4>
                <p className="muted">
                  Joining the DankPass partner network is completely free. We only take a small commission when customers redeem points at your business.
                </p>
              </div>
              <div className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
                <h4 className="font-medium text-brand-ink mb-2">How do customers redeem points?</h4>
                <p className="muted">
                  Customers can redeem points for discounts and perks directly through the app. You&apos;ll receive notifications and can track all redemptions in your partner dashboard.
                </p>
              </div>
              <div className="card hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(14,23,38,0.12)] transition-all">
                <h4 className="font-medium text-brand-ink mb-2">How long does approval take?</h4>
                <p className="muted">
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
