'use client';

import { motion } from 'framer-motion';
import { Gift, Crown, Lock, Star, Coffee, Car, Plane } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Perk {
  id: string;
  title: string;
  description: string | null;
  pointsCost: number;
  isPremiumOnly: boolean;
  imageUrl: string | null;
  category?: string;
  partner?: string;
  icon?: any;
  color?: string;
}

export default function PerksPage() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock user data - in real app, this would come from auth
  const userPoints = 1250;
  const isPremium = false;

  useEffect(() => {
    async function fetchPerks() {
      try {
        const response = await fetch('/api/perks');
        if (response.ok) {
          const data = await response.json();
          setPerks(data);
        }
      } catch (error) {
        console.error('Error fetching perks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPerks();
  }, []);

  const mockPerks = [
    {
      id: 1,
      title: '20% Off Edibles',
      description: 'Get 20% off any edible product',
      partner: 'Green Valley Dispensary',
      pointsCost: 500,
      isPremiumOnly: false,
      category: 'Dispensary',
      icon: Star,
      color: 'dp-mint'
    },
    {
      id: 2,
      title: 'Free Coffee',
      description: 'Complimentary coffee with any purchase',
      partner: 'Local Coffee Co.',
      pointsCost: 300,
      isPremiumOnly: false,
      category: 'Restaurant',
      icon: Coffee,
      color: 'dp-lime'
    },
    {
      id: 3,
      title: 'Free Delivery',
      description: 'Free delivery on orders over $50',
      partner: 'Pizza Palace',
      pointsCost: 200,
      isPremiumOnly: false,
      category: 'Restaurant',
      icon: Car,
      color: 'dp-blue'
    },
    {
      id: 4,
      title: 'VIP Lounge Access',
      description: 'Exclusive access to premium lounge area',
      partner: 'Elite Dispensary',
      pointsCost: 1000,
      isPremiumOnly: true,
      category: 'Premium',
      icon: Crown,
      color: 'dp-blue'
    },
    {
      id: 5,
      title: 'Free Appetizer',
      description: 'Complimentary appetizer with main course',
      partner: 'Fine Dining Restaurant',
      pointsCost: 400,
      isPremiumOnly: false,
      category: 'Restaurant',
      icon: Star,
      color: 'dp-mint'
    },
    {
      id: 6,
      title: 'Travel Voucher',
      description: '$50 travel voucher for any destination',
      partner: 'Travel Partner',
      pointsCost: 2000,
      isPremiumOnly: true,
      category: 'Premium',
      icon: Plane,
      color: 'dp-blue'
    }
  ];

  const categories = ['All', 'Dispensary', 'Restaurant', 'Premium'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const displayPerks = perks.length > 0 ? perks : mockPerks;
  
  const filteredPerks = selectedCategory === 'All' 
    ? displayPerks 
    : displayPerks.filter(perk => perk.category === selectedCategory || (selectedCategory === 'Premium' && perk.isPremiumOnly));

  const canAfford = (pointsCost: number) => userPoints >= pointsCost;

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="px-6 pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">🔥 Burn Rewards</h1>
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold text-dp-mint">
                {userPoints.toLocaleString()}
              </div>
              <div className="text-white/70">points available</div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-dp-blue-500 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-dp-blue-300 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white/70">Loading perks...</p>
              </div>
            ) : (
              filteredPerks.map((perk, index) => {
              const Icon = perk.icon || Gift;
              const canRedeem = canAfford(perk.pointsCost) && (!perk.isPremiumOnly || isPremium);
              
              return (
                <motion.div
                  key={perk.id}
                  className={`card relative overflow-hidden ${
                    !canRedeem ? 'opacity-60' : 'hover:bg-white/10'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={canRedeem ? { scale: 1.02 } : {}}
                  whileTap={canRedeem ? { scale: 0.98 } : {}}
                >
                  {/* Premium Lock Overlay */}
                  {perk.isPremiumOnly && !isPremium && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="w-8 h-8 bg-dp-blue-500/20 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-dp-blue-300" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 ${perk.color === 'dp-mint' ? 'bg-dp-mint/20' : perk.color === 'dp-lime' ? 'bg-dp-lime/20' : perk.color === 'dp-blue' ? 'bg-dp-blue/20' : 'bg-white/20'} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${perk.color === 'dp-mint' ? 'text-dp-mint' : perk.color === 'dp-lime' ? 'text-dp-lime' : perk.color === 'dp-blue' ? 'text-dp-blue' : 'text-white/70'}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white">{perk.title}</h3>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="text-sm font-medium text-dp-blue-300">
                            {perk.pointsCost} pts
                          </div>
                          {!canAfford(perk.pointsCost) && (
                            <div className="text-xs text-red-400">Need {perk.pointsCost - userPoints} more</div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-white/70 mb-2">{perk.description}</p>
                      <p className="text-xs text-white/50">{perk.partner}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    {canRedeem ? (
                      <button className="btn-primary w-full">
                        Redeem Now
                      </button>
                    ) : perk.isPremiumOnly && !isPremium ? (
                      <button className="btn-secondary w-full flex items-center justify-center gap-2">
                        <Crown className="w-4 h-4" />
                        Premium Required
                      </button>
                    ) : (
                      <button className="btn-secondary w-full opacity-50 cursor-not-allowed">
                        Not Enough Points
                      </button>
                    )}
                  </div>
                </motion.div>
              );
              })
            )}
          </div>

          {/* Premium CTA */}
          {!isPremium && (
            <motion.div
              className="mt-8 card bg-gradient-to-r from-dp-blue-500/20 to-dp-blue-600/20 border-dp-blue-500/30"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center">
                <Crown className="w-8 h-8 text-dp-blue-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Unlock Premium Perks
                </h3>
                <p className="text-sm text-white/70 mb-4">
                  Get access to exclusive rewards and earn 1.5x points on all purchases
                </p>
                <button className="btn-primary">
                  Upgrade to Premium - $7/month
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
