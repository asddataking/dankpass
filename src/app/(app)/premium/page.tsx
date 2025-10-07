'use client';

import { motion } from 'framer-motion';
import { Crown, Check, Star, Zap, Shield, Gift } from 'lucide-react';
import { useState } from 'react';

export default function PremiumPage() {
  const [isLoading, setIsLoading] = useState(false);
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

  const pricingPlans = [
    {
      name: 'Monthly',
      price: 7,
      period: 'month',
      description: 'Perfect for trying out premium features',
      popular: false,
      priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder'
    },
    {
      name: 'Annual',
      price: 70,
      period: 'year',
      description: 'Save 17% compared to monthly billing',
      popular: true,
      originalPrice: 84,
      priceId: process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID || 'price_annual_placeholder'
    }
  ];

  const handleSubscribe = async (priceId: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerEmail: 'user@example.com', // In real app, get from auth
          metadata: {
            userId: 'user_123', // In real app, get from auth
          },
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-dp-blue-500 to-dp-blue-300 rounded-full mx-auto mb-4 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-4">Upgrade to Premium</h1>
            <p className="text-white/70 max-w-md mx-auto">
              Unlock exclusive perks and earn more points with DankPass Premium
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  className="card text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className={`w-12 h-12 bg-${benefit.color}-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`w-6 h-6 text-${benefit.color}`} />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                  <p className="text-sm text-white/70">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Pricing Plans */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">Choose Your Plan</h3>
            <div className="grid grid-cols-1 gap-4">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  className={`card relative ${plan.popular ? 'border-dp-blue-500 bg-dp-blue-500/10' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-dp-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-white mb-2">{plan.name}</h4>
                    <div className="mb-2">
                      <span className="text-3xl font-bold text-white">${plan.price}</span>
                      <span className="text-white/70">/{plan.period}</span>
                      {plan.originalPrice && (
                        <div className="text-sm text-white/50 line-through">${plan.originalPrice}/year</div>
                      )}
                    </div>
                    <p className="text-sm text-white/70 mb-4">{plan.description}</p>
                    <button 
                      onClick={() => handleSubscribe(plan.priceId)}
                      disabled={isLoading}
                      className={`w-full py-3 px-6 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        plan.popular 
                          ? 'bg-dp-blue-500 hover:bg-dp-blue-600 text-white' 
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      {isLoading ? 'Processing...' : (plan.popular ? 'Start Premium' : 'Choose Plan')}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Premium Perks List */}
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">What&apos;s Included</h3>
            <div className="space-y-3">
              {premiumPerks.map((perk, index) => (
                <motion.div
                  key={perk}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <div className="w-6 h-6 bg-dp-mint/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-dp-mint" />
                  </div>
                  <span className="text-white/80">{perk}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Money Back Guarantee */}
          <motion.div
            className="card bg-gradient-to-r from-dp-mint/10 to-dp-lime/10 border-dp-mint/20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-12 h-12 bg-dp-mint/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-dp-mint" />
            </div>
            <h3 className="font-semibold text-white mb-2">30-Day Money Back Guarantee</h3>
            <p className="text-sm text-white/70">
              Not satisfied? Cancel anytime within 30 days for a full refund. No questions asked.
            </p>
          </motion.div>

          {/* FAQ */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div className="card">
                <h4 className="font-medium text-white mb-2">Can I cancel anytime?</h4>
                <p className="text-sm text-white/70">
                  Yes! You can cancel your Premium subscription at any time. You&apos;ll continue to have access to Premium features until the end of your billing period.
                </p>
              </div>
              <div className="card">
                <h4 className="font-medium text-white mb-2">Do points expire?</h4>
                <p className="text-sm text-white/70">
                  Points never expire for Premium members. Free users&apos; points expire after 12 months of inactivity.
                </p>
              </div>
              <div className="card">
                <h4 className="font-medium text-white mb-2">How do I redeem premium perks?</h4>
                <p className="text-sm text-white/70">
                  Premium perks are automatically applied to your account. Simply show your Premium status in the app when visiting partner locations.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
