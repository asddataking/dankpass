'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Camera, Crown, TrendingUp, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { useRouter, useSearchParams } from 'next/navigation';

export default function WelcomePage() {
  const user = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [referralProcessed, setReferralProcessed] = useState(false);
  const [referralError, setReferralError] = useState<string | null>(null);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [referrerName, setReferrerName] = useState('');
  const [showFeatureTour, setShowFeatureTour] = useState(true);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Camera,
      title: 'Upload Receipts',
      description: 'Take a photo of any receipt from dispensaries or restaurants to earn points instantly.',
      color: 'brand-primary'
    },
    {
      icon: TrendingUp,
      title: 'Earn Points',
      description: 'Earn 1 point per dollar spent. Premium members get 1.5x points on every purchase!',
      color: 'brand-success'
    },
    {
      icon: Gift,
      title: 'Redeem Rewards',
      description: 'Use your points for free products, discounts, and exclusive perks at our partner locations.',
      color: 'brand-warn'
    },
    {
      icon: Crown,
      title: 'Go Premium',
      description: 'Unlock unlimited uploads, 1.5x points, and exclusive rewards for just $7/month.',
      color: 'brand-primary'
    }
  ];

  useEffect(() => {
    async function processReferral() {
      if (!refCode || !user || isProcessing || referralProcessed) return;
      
      setIsProcessing(true);
      
      try {
        // Process referral
        const response = await fetch('/api/referrals/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ referralCode: refCode }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setBonusPoints(data.bonusPoints || 250);
          setReferrerName(data.referrerName || 'a friend');
          setReferralProcessed(true);
        } else {
          console.error('Referral error:', data.error);
          setReferralError(data.error || 'Failed to process referral');
        }
      } catch (error) {
        console.error('Error processing referral:', error);
        setReferralError('Failed to process referral');
      } finally {
        setIsProcessing(false);
      }
    }

    processReferral();
  }, [refCode, user, isProcessing, referralProcessed]);

  const handleSkipTour = () => {
    router.push('/dashboard');
  };

  const handleNextFeature = () => {
    if (currentFeature < features.length - 1) {
      setCurrentFeature(currentFeature + 1);
    } else {
      router.push('/dashboard');
    }
  };

  const handlePrevFeature = () => {
    if (currentFeature > 0) {
      setCurrentFeature(currentFeature - 1);
    }
  };

  if (!showFeatureTour && !referralProcessed) {
    router.push('/dashboard');
    return null;
  }

  const Feature = features[currentFeature];
  const FeatureIcon = Feature.icon;

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full"
      >
        {/* Referral Success Banner */}
        <AnimatePresence>
          {referralProcessed && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card bg-gradient-to-r from-brand-success/10 to-brand-primary/10 border-brand-success/30 mb-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 text-brand-success" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-ink mb-1">
                    🎉 Welcome Bonus Unlocked!
                  </h3>
                  <p className="text-sm text-brand-subtle mb-2">
                    You earned <span className="font-bold text-brand-success">{bonusPoints} points</span> from {referrerName}'s referral!
                  </p>
                  <div className="flex items-center gap-2 text-xs text-brand-success">
                    <Check className="w-4 h-4" />
                    Points added to your account
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {referralError && !referralProcessed && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card bg-brand-error/10 border-brand-error/30 mb-6"
            >
              <p className="text-sm text-brand-error">{referralError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome Card */}
        <div className="card relative overflow-hidden">
          {/* Skip button */}
          <button
            onClick={handleSkipTour}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-bg hover:bg-brand-ink/10 flex items-center justify-center transition-colors"
            title="Skip tour"
          >
            <X className="w-4 h-4 text-brand-subtle" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-brand-ink mb-2">
              Welcome to DankPass! 🌿
            </h1>
            <p className="text-brand-subtle">
              {user?.displayName ? `Hi ${user.displayName.split(' ')[0]}! ` : ''}
              Let's show you around
            </p>
          </div>

          {/* Feature showcase */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <div className="text-center mb-6">
                <div className={`w-20 h-20 bg-${Feature.color}/10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <FeatureIcon className={`w-10 h-10 text-${Feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-brand-ink mb-2">
                  {Feature.title}
                </h3>
                <p className="text-brand-subtle">
                  {Feature.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentFeature
                    ? 'bg-brand-primary w-6'
                    : 'bg-brand-ink/20'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {currentFeature > 0 && (
              <button
                onClick={handlePrevFeature}
                className="btn-ghost flex-1"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNextFeature}
              className="btn-primary flex-1"
            >
              {currentFeature === features.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>

          {/* Skip text */}
          <div className="text-center mt-4">
            <button
              onClick={handleSkipTour}
              className="text-sm text-brand-subtle hover:text-brand-ink transition-colors"
            >
              Skip tour and go to dashboard →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

