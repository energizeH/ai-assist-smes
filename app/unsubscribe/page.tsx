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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              AI-Assist for SMEs
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          {status === 'done' ? (
            <>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Unsubscribed</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                You have been unsubscribed from marketing emails. You will still receive important account and service emails.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                You can re-enable marketing emails at any time from your{' '}
                <Link href="/dashboard/settings" className="text-blue-600 dark:text-blue-400 hover:underline">
                  account settings
                </Link>.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Go to Homepage
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Unsubscribe</h1>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Enter your email address to unsubscribe from marketing emails.
              </p>
              <form onSubmit={handleUnsubscribe} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {status === 'loading' ? 'Processing...' : 'Unsubscribe'}
                </button>
              </form>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  )
}
