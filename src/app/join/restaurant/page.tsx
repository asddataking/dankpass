'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Star, Upload, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@stackframe/stack';

export default function RestaurantSignupPage() {
  const user = useUser();
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    phone: '',
    email: user?.primaryEmail || '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          businessName: formData.businessName,
          businessType: 'restaurant',
          description: formData.description,
          phone: formData.phone,
          email: formData.email,
          website: formData.website
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <div className="px-6 pt-16 pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="card">
              <div className="w-16 h-16 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-brand-success" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-brand-ink mb-4">Application Submitted!</h1>
              <p className="muted mb-6">
                Thank you for your interest in joining the DankPass network. We'll review your application and get back to you within 2-3 business days.
              </p>
              <div className="space-y-3">
                <Link href="/dashboard" className="btn-primary w-full">
                  Go to Dashboard
                </Link>
                <Link href="/" className="btn-ghost w-full">
                  Back to Home
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-6 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/join" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to join
            </Link>
            
            <div className="w-16 h-16 bg-dp-lime/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-dp-lime" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Restaurant Application</h1>
            <p className="text-white/70">Join our network of food & dining establishments</p>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            {/* Business Information */}
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-6">Restaurant Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-white mb-2">
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-dp-blue-500 focus:border-transparent"
                    placeholder="Your restaurant name"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                    Restaurant Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-dp-blue-500 focus:border-transparent"
                    placeholder="Tell us about your restaurant, cuisine type, specialties..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-dp-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-dp-blue-500 focus:border-transparent"
                      placeholder="restaurant@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-white mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-dp-blue-500 focus:border-transparent"
                    placeholder="https://yourrestaurant.com"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-6">Location Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-white mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-dp-blue-500 focus:border-transparent"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-white mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-dp-blue-500 focus:border-transparent"
                      placeholder="Los Angeles"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-white mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-dp-blue-500 focus:border-transparent"
                      placeholder="CA"
                    />
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-white mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-dp-blue-500 focus:border-transparent"
                      placeholder="90013"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Reminder */}
            <div className="card bg-gradient-to-r from-dp-lime/10 to-dp-blue/10 border-dp-lime/20">
              <h3 className="text-lg font-semibold text-white mb-4">Why Join DankPass?</h3>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-dp-lime mt-0.5 flex-shrink-0" />
                  <span>Attract new customers to your restaurant</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-dp-lime mt-0.5 flex-shrink-0" />
                  <span>Boost repeat visits and customer loyalty</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-dp-lime mt-0.5 flex-shrink-0" />
                  <span>Gain competitive advantage in your area</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-dp-lime mt-0.5 flex-shrink-0" />
                  <span>Simple point redemption system</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Submitting Application...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>

            <p className="text-center text-sm text-white/60">
              By submitting this application, you agree to our{' '}
              <Link href="/terms" className="text-dp-blue-300 hover:text-dp-blue-200">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-dp-blue-300 hover:text-dp-blue-200">
                Privacy Policy
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
