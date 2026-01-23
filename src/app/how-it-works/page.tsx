'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Upload, TrendingUp, Gift, Sparkles } from 'lucide-react';
import { APP_ROUTES } from '@/lib/app-config';

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      icon: Upload,
      title: 'Upload Receipt',
      description: 'Snap a photo of your receipt from dispensaries or restaurants. Our AI-powered system automatically extracts purchase details.',
      color: 'brand-primary'
    },
    {
      number: 2,
      icon: TrendingUp,
      title: 'Earn Points',
      description: 'Get 10 points for every $1 you spend. Premium members earn 15 points per dollar (1.5x multiplier). Points are awarded instantly!',
      color: 'brand-success'
    },
    {
      number: 3,
      icon: Gift,
      title: 'Burn Rewards',
      description: 'Redeem your points for free weed, exclusive discounts, VIP perks, and more at partner locations.',
      color: 'brand-warn'
    }
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-success/20 to-brand-warn/20 text-brand-success px-4 py-2 rounded-full border border-brand-success/30">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">🔥 Earn & Burn Rewards</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-ink mb-4">
              How to Earn Free Weed in 3 Steps
            </h1>
            <p className="text-lg text-brand-subtle max-w-2xl mx-auto">
              It&apos;s simple: upload receipts, earn points, burn for rewards. Start earning today!
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-6 md:space-y-8 mb-12 max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  className="card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 bg-${step.color} rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-2xl`}>
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon className={`w-6 h-6 text-${step.color}`} />
                        <h2 className="text-2xl font-bold text-brand-ink">{step.title}</h2>
                      </div>
                      <p className="text-brand-subtle text-lg leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="card bg-gradient-to-br from-brand-primary/10 to-brand-success/10 border-brand-primary/20 mb-12 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-brand-ink mb-4">Why DankPass?</h3>
            <ul className="space-y-3 text-brand-subtle">
              <li className="flex items-start gap-3">
                <span className="text-brand-primary font-bold">•</span>
                <span>AI-powered receipt scanning for instant point calculation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary font-bold">•</span>
                <span>Works with receipts from dispensaries and restaurants</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary font-bold">•</span>
                <span>No limits on how many receipts you can upload (Premium)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary font-bold">•</span>
                <span>Exclusive perks and discounts at partner locations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary font-bold">•</span>
                <span>Refer friends and you both get 250 bonus points</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link 
              href={APP_ROUTES.SIGNIN}
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-lg"
            >
              <TrendingUp className="w-5 h-5" />
              Get Started Free
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
