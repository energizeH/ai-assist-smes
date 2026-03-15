'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Check your email for a reset link.')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="orb orb-blue w-96 h-96 -top-48 -left-48" />
      <div className="orb orb-violet w-72 h-72 -bottom-36 -right-36" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fadeIn">
          <Link href="/" className="text-3xl font-bold gradient-text">
            AI-Assist for SMEs
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-[#f1f5f9]">Forgot Password</h2>
          <p className="mt-2 text-[#94a3b8]">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        <div className="glass-card-strong p-8 animate-fadeIn stagger-2">
          {status === 'success' ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-emerald-500/20">
                <svg className="w-8 h-8 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#f1f5f9] mb-2">Email Sent!</h3>
              <p className="text-[#94a3b8] mb-6">{message}</p>
              <Link href="/login" className="text-[#60a5fa] hover:text-[#3b82f6] font-medium transition">
                &larr; Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {message}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#94a3b8] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input w-full"
                  placeholder="you@company.com"
                  disabled={status === 'loading'}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </button>
              <div className="text-center">
                <Link href="/login" className="text-[#64748b] hover:text-[#f1f5f9] text-sm transition">
                  &larr; Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
