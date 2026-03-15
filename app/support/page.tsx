'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `[Support Request] ${formData.subject}\n\n${formData.message}`,
          service: 'Support Request',
        }),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        const data = await response.json()
        setErrorMsg(data.error || 'Failed to send message. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again or email us directly.')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Header */}
      <header className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-xl font-bold gradient-text hover:opacity-80 transition-opacity">
              &larr; Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-bold text-[#f1f5f9] mb-2">Support Centre</h1>
          <p className="text-[#94a3b8] mb-8">We&apos;re here to help you get the most out of AI-Assist</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="glass-card-strong p-8">
              <h2 className="text-2xl font-bold text-[#f1f5f9] mb-4">Get in Touch</h2>
              {status === 'success' && (
                <div className="mb-4 p-4 rounded-xl border border-[#10b981]/30 bg-[#10b981]/10">
                  <p className="text-emerald-400 text-sm font-medium">Your support request has been sent. We&apos;ll get back to you as soon as possible.</p>
                </div>
              )}
              {status === 'error' && errorMsg && (
                <div className="mb-4 p-4 rounded-xl border border-[#f43f5e]/30 bg-[#f43f5e]/10">
                  <p className="text-rose-400 text-sm">{errorMsg}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="input"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Support Resources */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">📧</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#f1f5f9] mb-2">Email Support</h3>
                    <p className="text-[#94a3b8] mb-2">Get help from our support team</p>
                    <a href="mailto:support@aiassistsmes.co.uk" className="text-[#60a5fa] hover:text-[#3b82f6] transition">
                      support@aiassistsmes.co.uk
                    </a>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">💬</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#f1f5f9] mb-2">Live Chat</h3>
                    <p className="text-[#94a3b8] mb-2">Chat with us in real-time</p>
                    <p className="text-sm text-[#64748b]">Available Mon-Fri, 9am-5pm GMT</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">📚</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#f1f5f9] mb-2">Documentation</h3>
                    <p className="text-[#94a3b8] mb-2">Browse our knowledge base</p>
                    <Link href="/blog" className="text-[#60a5fa] hover:text-[#3b82f6] transition">
                      View Guides &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">❓</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#f1f5f9] mb-2">FAQs</h3>
                    <p className="text-[#94a3b8] mb-2">Find answers to common questions</p>
                    <Link href="/plans" className="text-[#60a5fa] hover:text-[#3b82f6] transition">
                      Browse FAQs &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
