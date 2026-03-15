'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import PasswordStrength, { isPasswordStrongEnough } from '../components/PasswordStrength'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', company: '', password: '' })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isPasswordStrongEnough(formData.password)) {
      setStatus('error')
      setError('Password is not strong enough. Please meet at least 4 of the 5 requirements.')
      return
    }

    if (!acceptedTerms) {
      setStatus('error')
      setError('You must accept the Terms of Service and Privacy Policy to create an account.')
      return
    }

    setStatus('loading')
    setError('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, accepted_terms: true }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setSuccessMessage(data.message || 'Account created. Please check your email to verify your account.')
        setFormData({ name: '', email: '', company: '', password: '' })
        setAcceptedTerms(false)
        setTimeout(() => router.push('/login'), 3000)
      } else {
        setStatus('error')
        setError(data.error || 'Registration failed')
      }
    } catch {
      setStatus('error')
      setError('An unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="orb orb-violet w-96 h-96 -top-48 -left-48" />
      <div className="orb orb-blue w-80 h-80 -bottom-40 -right-40" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fadeIn">
          <Link href="/" className="text-3xl font-bold gradient-text">AI-Assist for SMEs</Link>
          <h2 className="mt-6 text-3xl font-bold text-[#f1f5f9]">Create Account</h2>
          <p className="mt-2 text-[#94a3b8]">Start automating your business today</p>
        </div>

        <div className="glass-card-strong p-8 animate-fadeIn stagger-2">
          {status === 'success' && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <p className="text-emerald-400 text-sm">{successMessage}</p>
              <p className="text-emerald-500/70 text-xs mt-1">Redirecting to login...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#94a3b8] mb-1">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                disabled={status === 'loading'}
                className="input w-full"
                placeholder="John Smith" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#94a3b8] mb-1">Email Address</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                disabled={status === 'loading'}
                className="input w-full"
                placeholder="john@company.com" />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-[#94a3b8] mb-1">Company Name (Optional)</label>
              <input type="text" id="company" name="company" value={formData.company} onChange={handleChange}
                disabled={status === 'loading'}
                className="input w-full"
                placeholder="Your Company Ltd" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#94a3b8] mb-1">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required
                disabled={status === 'loading'} minLength={8}
                className="input w-full"
                placeholder="Min 8 characters" />
              <PasswordStrength password={formData.password} />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                disabled={status === 'loading'}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-white/5 text-[#3b82f6] focus:ring-[#3b82f6] cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-[#94a3b8] cursor-pointer">
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="text-[#60a5fa] hover:text-[#3b82f6] font-medium transition">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" target="_blank" className="text-[#60a5fa] hover:text-[#3b82f6] font-medium transition">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button type="submit" disabled={status === 'loading'}
              className="btn btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              {status === 'loading' ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-[#94a3b8] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#60a5fa] hover:text-[#3b82f6] font-semibold transition">Sign in</Link>
          </p>
        </div>

        <div className="mt-8 text-center animate-fadeIn stagger-3">
          <Link href="/" className="text-[#64748b] hover:text-[#f1f5f9] transition">&larr; Back to home</Link>
        </div>
      </div>
    </div>
  )
}
