'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const isSuccess = searchParams.get('success') === 'true'
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>(isSuccess ? 'done' : 'idle')

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await fetch('/api/user/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus('done')
    } catch {
      setStatus('done') // Show success regardless to not leak user info
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col">
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold gradient-text">
              AI-Assist for SMEs
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {status === 'done' ? (
            <>
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#f1f5f9] mb-3">Unsubscribed</h1>
              <p className="text-[#94a3b8] mb-8">
                You have been unsubscribed from marketing emails. You will still receive important account and service emails.
              </p>
              <p className="text-sm text-[#64748b] mb-6">
                You can re-enable marketing emails at any time from your{' '}
                <Link href="/dashboard/settings" className="text-[#60a5fa] hover:text-[#3b82f6] transition">
                  account settings
                </Link>.
              </p>
              <Link
                href="/"
                className="btn btn-primary inline-block"
              >
                Go to Homepage
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[#f1f5f9] mb-3">Unsubscribe</h1>
              <p className="text-[#94a3b8] mb-6">
                Enter your email address to unsubscribe from marketing emails.
              </p>
              <form onSubmit={handleUnsubscribe} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="input w-full"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn btn-primary w-full disabled:opacity-50"
                >
                  {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
                </button>
              </form>
              <p className="text-xs text-[#64748b] mt-4">
                This will only unsubscribe you from marketing and promotional emails. You will continue to receive essential account and service emails.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <p className="text-[#94a3b8]">Loading...</p>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  )
}
