'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@stackframe/stack'

export default function AuthCallbackPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    if (!isLoaded) return // Still loading

    if (isSignedIn) {
      // User is authenticated, redirect to dashboard
      router.push('/me')
    } else {
      // User is not authenticated, redirect to sign in
      router.push('/auth/signin')
    }
  }, [isLoaded, isSignedIn, router])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-purple-500 rounded-2xl mx-auto mb-4 animate-pulse"></div>
        <h2 className="text-2xl font-bold mb-2">Signing you in...</h2>
        <p className="text-gray-400">Please wait while we complete your authentication.</p>
      </div>
    </div>
  )
}
