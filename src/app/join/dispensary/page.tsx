'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, MapPin, Upload, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@stackframe/stack';
import { ErrorAlert, useAlert } from '@/components/ErrorAlert';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function DispensarySignupPage() {
  const user = useUser();
  const { alerts, addAlert, removeAlert } = useAlert();
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
          businessType: 'dispensary',
          description: formData.description,
          phone: formData.phone,
          email: formData.email,
          website: formData.website
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        addAlert({
          type: 'success',
          title: 'Application Submitted!',
          message: 'Thank you for your interest. We\'ll review your application within 2-3 business days.',
          autoDismiss: 5000
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      addAlert({
        type: 'error',
        title: 'Submission Failed',
        message: error instanceof Error ? error.message : 'Please try again later.'
      });
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
        {/* Alerts */}
        <div className="max-w-2xl mx-auto mb-6 space-y-3">
          {alerts.map((alert) => (
            <ErrorAlert key={alert.id} {...alert} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <Link href="/join" className="inline-flex items-center gap-2 text-brand-subtle hover:text-brand-ink mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to join
            </Link>
            
            <div className="w-16 h-16 bg-brand-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-brand-success" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-ink mb-2">Dispensary Application</h1>
            <p className="muted">Join our network of cannabis retailers</p>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            {/* Business Information */}
            <div className="card">
              <h3 className="text-lg sm:text-xl font-semibold text-brand-ink mb-6">Business Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-brand-ink mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    className="input"
                    placeholder="Your dispensary name"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-brand-ink mb-2">
                    Business Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="input resize-none"
                    placeholder="Tell us about your dispensary..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-brand-ink mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-ink mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="business@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-brand-ink mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://yourdispensary.com"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="card">
              <h3 className="text-lg sm:text-xl font-semibold text-brand-ink mb-6">Location Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-brand-ink mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="input"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-brand-ink mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="input"
                      placeholder="San Francisco"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-brand-ink mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="input"
                      placeholder="CA"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label htmlFor="zipCode" className="block text-sm font-medium text-brand-ink mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="input"
                      placeholder="94103"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Reminder */}
            <div className="card bg-gradient-to-r from-brand-success/10 to-brand-warn/10 border-brand-success/20">
              <h3 className="text-base sm:text-lg font-semibold text-brand-ink mb-4">Why Join DankPass?</h3>
              <ul className="space-y-2 text-brand-ink text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-brand-success mt-0.5 flex-shrink-0" />
                  <span>Reach thousands of cannabis consumers in your area</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-brand-success mt-0.5 flex-shrink-0" />
                  <span>Increase customer loyalty and repeat visits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-brand-success mt-0.5 flex-shrink-0" />
                  <span>Track sales and customer analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-brand-success mt-0.5 flex-shrink-0" />
                  <span>Easy point redemption management</span>
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
                <LoadingSpinner size="sm" text="Submitting Application..." />
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Submit Application
                </>
              )}
            </button>

            <p className="text-center text-xs sm:text-sm text-brand-subtle">
              By submitting this application, you agree to our{' '}
              <Link href="/terms" className="text-brand-primary hover:text-brand-primary/80 font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-brand-primary hover:text-brand-primary/80 font-medium">
                Privacy Policy
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
