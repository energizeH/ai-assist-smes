'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PasswordStrength, { isPasswordStrongEnough } from '../components/PasswordStrength'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    if (password !== confirmPassword) {
      setStatus('error')
      setMessage('Passwords do not match.')
      return
    }

    if (!isPasswordStrongEnough(password)) {
      setStatus('error')
      setMessage('Password is not strong enough. Please meet at least 4 of the 5 requirements.')
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Password updated successfully.')
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to update password. The link may have expired.')
      }
    } catch (err) {
      setStatus('error')
      setMessage('An unexpected error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="orb orb-violet w-96 h-96 -top-48 -right-48" />
      <div className="orb orb-blue w-72 h-72 -bottom-36 -left-36" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fadeIn">
          <Link href="/" className="text-3xl font-bold gradient-text">
            AI-Assist for SMEs
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-[#f1f5f9]">Set New Password</h2>
          <p className="mt-2 text-[#94a3b8]">Enter your new password below</p>
        </div>

        <div className="glass-card-strong p-8 animate-fadeIn stagger-2">
          {status === 'success' ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-emerald-500/20">
                <svg className="w-8 h-8 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#f1f5f9] mb-2">Password Updated!</h3>
              <p className="text-[#94a3b8] mb-6">{message}</p>
              <p className="text-sm text-[#64748b]">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {message}
                </div>
              )}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#94a3b8] mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full"
                  placeholder="Minimum 8 characters"
                  minLength={8}
                  disabled={status === 'loading'}
                />
                <PasswordStrength password={password} />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#94a3b8] mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input w-full"
                  placeholder="Repeat your new password"
                  minLength={8}
                  disabled={status === 'loading'}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Updating Password...' : 'Update Password'}
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
