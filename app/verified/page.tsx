'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function VerifiedPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6">
            <svg 
              className="w-12 h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={3} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Email Verified! ✅
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg">
            Your account has been successfully verified.
          </p>

          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Welcome to AI-Assist for SMEs! You can now access all features.
          </p>

          {/* Auto-redirect info */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Redirecting to dashboard in <span className="font-bold text-xl">{countdown}</span> seconds...
            </p>
          </div>

          {/* Manual button */}
          <Link
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Go to Dashboard Now
          </Link>

          {/* Additional info */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help getting started?
            </p>
            <Link 
              href="/support" 
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Visit our Help Center
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300 transition">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-gray-700 dark:hover:text-gray-300 transition">Cookie Policy</Link>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} AI-Assist for SMEs. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
