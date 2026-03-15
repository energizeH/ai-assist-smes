'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        if (data.message?.includes('already')) {
          setStatus('already')
        } else {
          setStatus('success')
          setEmail('')
        }
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 max-w-md mx-auto">
      <div className="flex gap-4 w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 backdrop-blur-sm"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-white text-[#3b82f6] font-bold px-6 py-3 rounded-lg hover:bg-white/90 transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {status === 'success' && (
        <p className="text-sm text-white/80 font-medium">You&apos;re subscribed — welcome aboard.</p>
      )}
      {status === 'already' && (
        <p className="text-sm text-white/80 font-medium">You&apos;re already subscribed.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-300 font-medium">Something went wrong. Please try again.</p>
      )}
    </form>
  )
}
