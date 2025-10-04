'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'
import { signInWithEmail } from '@/lib/auth'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await signInWithEmail(email)
      setMessage('Check your email for the magic link!')
    } catch (error) {
      console.error('Sign in error:', error)
      setMessage('Failed to send magic link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-purple-500 rounded-2xl mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold">DankPass</h1>
          <p className="text-gray-400 mt-2">Weed + Food Loyalty Program</p>
        </div>

        {/* Sign In Form */}
        <div className="p-8 rounded-2xl bg-gray-900 border border-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-purple-500 rounded-lg text-white font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending Magic Link...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Send Magic Link
                  <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-lg text-center ${
              message.includes('Check your email') 
                ? 'bg-green-500/20 text-green-500 border border-green-500/50'
                : 'bg-red-500/20 text-red-500 border border-red-500/50'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              We&apos;ll send you a magic link to sign in. No password required!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
