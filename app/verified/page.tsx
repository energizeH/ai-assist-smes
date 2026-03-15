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
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="orb orb-emerald w-96 h-96 -top-48 -right-48" />
      <div className="orb orb-blue w-72 h-72 -bottom-36 -left-36" />

      <div className="max-w-md w-full relative z-10">
        <div className="glass-card-strong p-8 text-center animate-fadeIn">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full flex items-center justify-center mb-6 animate-glow-pulse">
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

          <h1 className="text-3xl font-bold text-[#f1f5f9] mb-3">
            Email Verified!
          </h1>

          <p className="text-[#94a3b8] mb-2 text-lg">
            Your account has been successfully verified.
          </p>

          <p className="text-[#64748b] mb-8">
            Welcome to AI-Assist for SMEs! You can now access all features.
          </p>

          {/* Auto-redirect info */}
          <div className="bg-[#3b82f6]/10 border border-[#3b82f6]/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-[#60a5fa]">
              Redirecting to dashboard in <span className="font-bold text-xl">{countdown}</span> seconds...
            </p>
          </div>

          {/* Manual button */}
          <Link
            href="/dashboard"
            className="btn btn-primary inline-block py-3 px-8 text-base"
          >
            Go to Dashboard Now
          </Link>

          {/* Additional info */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-sm text-[#64748b]">
              Need help getting started?
            </p>
            <Link
              href="/support"
              className="text-[#60a5fa] hover:text-[#3b82f6] text-sm font-medium transition"
            >
              Visit our Help Centre
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2 animate-fadeIn stagger-2">
          <div className="flex justify-center gap-4 text-xs text-[#64748b]">
            <Link href="/privacy" className="hover:text-[#f1f5f9] transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#f1f5f9] transition">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-[#f1f5f9] transition">Cookie Policy</Link>
          </div>
          <p className="text-[#64748b] text-xs">
            &copy; {new Date().getFullYear()} AI-Assist for SMEs. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
