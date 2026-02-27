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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-blue-600">
            AI-Assist for SMEs
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-gray-600">Enter your email and we'll send you a reset link</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {status === 'success' ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Sent!</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                ← Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {message}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="you@company.com"
                  disabled={status === 'loading'}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
              </button>
              <div className="text-center">
                <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
