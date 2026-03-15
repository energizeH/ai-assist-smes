'use client'

import Link from 'next/link'
import { useState } from 'react'
import LegalFooter from '../components/LegalFooter'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', company: '', service: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Navigation */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold gradient-text">AI-Assist for SMEs</Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-[#94a3b8] hover:text-white transition">Home</Link>
              <Link href="/about" className="text-[#94a3b8] hover:text-white transition">About</Link>
              <Link href="/services" className="text-[#94a3b8] hover:text-white transition">Services</Link>
              <Link href="/plans" className="text-[#94a3b8] hover:text-white transition">Pricing</Link>
              <Link href="/contact" className="text-white font-semibold transition">Contact</Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="px-4 py-2 text-[#94a3b8] hover:text-white font-medium transition">Login</Link>
              <Link href="/register" className="btn btn-primary text-sm">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="section-gradient relative py-20 overflow-hidden">
        <div className="orb orb-blue w-80 h-80 -top-40 -right-40" />
        <div className="orb orb-violet w-64 h-64 -bottom-32 -left-32" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Get In Touch</span>
          </h1>
          <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto">
            Book a free consultation or ask us anything about AI automation for your business
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#f1f5f9] mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(59,130,246,0.15)' }}>📍</div>
                    <div>
                      <div className="font-semibold text-[#f1f5f9]">Location</div>
                      <div className="text-[#94a3b8]">Birmingham, West Midlands, UK</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(59,130,246,0.15)' }}>📧</div>
                    <div>
                      <div className="font-semibold text-[#f1f5f9]">Email</div>
                      <div className="text-[#94a3b8]">info@aiassistsmes.co.uk</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(59,130,246,0.15)' }}>📞</div>
                    <div>
                      <div className="font-semibold text-[#f1f5f9]">Phone</div>
                      <div className="text-[#94a3b8]"><a href="tel:+441210000000" className="hover:text-white transition">+44 121 000 0000</a></div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(59,130,246,0.15)' }}>⏰</div>
                    <div>
                      <div className="font-semibold text-[#f1f5f9]">Hours</div>
                      <div className="text-[#94a3b8]">Mon-Fri: 9am - 6pm GMT</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-bold text-[#f1f5f9] mb-2">🚀 Free Consultation</h3>
                <p className="text-[#94a3b8] text-sm">Book a free 30-minute call to discuss your automation needs. No obligation, no pushy sales.</p>
              </div>

              <div className="glass-card p-6" style={{ borderColor: 'rgba(16,185,129,0.2)' }}>
                <h3 className="font-bold text-[#f1f5f9] mb-2">⚡ Quick Response</h3>
                <p className="text-[#94a3b8] text-sm">We typically respond within 2 hours during business hours.</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div className="glass-card text-center py-16 px-8">
                  <div className="text-6xl mb-6">✅</div>
                  <h2 className="text-3xl font-bold text-[#f1f5f9] mb-4">Message Received!</h2>
                  <p className="text-xl text-[#94a3b8] mb-8">Thank you for getting in touch. We will be in contact within 2 hours.</p>
                  <button onClick={() => setStatus('idle')} className="btn btn-primary">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-[#f1f5f9]">Book a Free Consultation</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#94a3b8] mb-2">Full Name *</label>
                      <input name="name" value={formData.name} onChange={handleChange} required placeholder="John Smith" className="w-full px-4 py-3 rounded-lg bg-[#0a0f1e] border border-white/10 text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6]/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#94a3b8] mb-2">Email Address *</label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@business.com" className="w-full px-4 py-3 rounded-lg bg-[#0a0f1e] border border-white/10 text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6]/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#94a3b8] mb-2">Phone Number</label>
                      <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+44 7700 000000" className="w-full px-4 py-3 rounded-lg bg-[#0a0f1e] border border-white/10 text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6]/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#94a3b8] mb-2">Company Name</label>
                      <input name="company" value={formData.company} onChange={handleChange} placeholder="Your Business Ltd" className="w-full px-4 py-3 rounded-lg bg-[#0a0f1e] border border-white/10 text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6]/50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#94a3b8] mb-2">Service Interested In</label>
                    <select name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-[#0a0f1e] border border-white/10 text-[#f1f5f9] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6]/50">
                      <option value="">Select a service...</option>
                      <option value="ai-receptionist">AI Receptionist System</option>
                      <option value="workflow">Workflow Automation</option>
                      <option value="email">AI Email Systems</option>
                      <option value="analytics">Business Intelligence</option>
                      <option value="whatsapp">WhatsApp Automation</option>
                      <option value="custom">Custom AI Solution</option>
                      <option value="not-sure">Not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#94a3b8] mb-2">Tell Us About Your Business *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Describe your business, current challenges, and what you hope to achieve with AI automation..." className="w-full px-4 py-3 rounded-lg bg-[#0a0f1e] border border-white/10 text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6]/50 resize-none" />
                  </div>
                  <button type="submit" disabled={status === 'loading'} className="btn btn-primary w-full py-4 text-lg">
                    {status === 'loading' ? 'Sending...' : 'Send Message & Book Consultation'}
                  </button>
                  {status === 'error' && (
                    <p className="text-sm text-red-400 text-center">Something went wrong. Please try again.</p>
                  )}
                  <p className="text-sm text-[#64748b] text-center">
                    By submitting, you agree to our <Link href="/privacy" className="text-[#60a5fa] hover:text-white transition">Privacy Policy</Link>. We never share your data.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <LegalFooter />
    </div>
  )
}
