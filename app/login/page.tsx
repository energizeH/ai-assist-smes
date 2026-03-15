'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Login failed. Please check your credentials.')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="orb orb-blue w-96 h-96 -top-48 -right-48" />
      <div className="orb orb-violet w-80 h-80 -bottom-40 -left-40" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fadeIn">
          <Link href="/" className="text-3xl font-bold gradient-text">
            AI-Assist for SMEs
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-[#f1f5f9]">Welcome back</h2>
          <p className="mt-2 text-[#94a3b8]">Sign in to your account</p>
        </div>

        <div className="glass-card-strong p-8 animate-fadeIn stagger-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#94a3b8] mb-2">
                Email Address
              </label>
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#94a3b8] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password" type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full pr-16"
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#f1f5f9] text-sm transition">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember" type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#3b82f6] focus:ring-[#3b82f6]" />
                <label htmlFor="remember" className="ml-2 block text-sm text-[#94a3b8]">Remember me</label>
              </div>
              <Link href="/forgot-password" className="text-sm text-[#60a5fa] hover:text-[#3b82f6] transition">
                Forgot password?
              </Link>
            </div>
            <button type="submit" disabled={loading}
              className="btn btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-[#94a3b8]">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-[#60a5fa] hover:text-[#3b82f6] font-medium transition">Sign up</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center animate-fadeIn stagger-3">
          <Link href="/" className="text-[#64748b] hover:text-[#f1f5f9] transition">&larr; Back to home</Link>
        </div>
      </div>
    </div>
  )
}
