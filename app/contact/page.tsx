'use client'

import Link from 'next/link'
import { useState } from 'react'

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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">AI-Assist for SMEs</Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">Home</Link>
              <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">About</Link>
              <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">Services</Link>
              <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">Pricing</Link>
              <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">Blog</Link>
              <Link href="/contact" className="text-primary-600 font-semibold">Contact</Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="btn btn-secondary">Login</Link>
              <Link href="/register" className="btn btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Book a free consultation or ask us anything about AI automation for your business
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-xl flex-shrink-0">📍</div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Location</div>
                      <div className="text-gray-600 dark:text-gray-300">Birmingham, West Midlands, UK</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-xl flex-shrink-0">📧</div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Email</div>
                      <div className="text-gray-600 dark:text-gray-300">hello@ai-assist-smes.com</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-xl flex-shrink-0">📞</div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Phone</div>
                      <div className="text-gray-600 dark:text-gray-300">+44 121 000 0000</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center text-xl flex-shrink-0">⏰</div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">Hours</div>
                      <div className="text-gray-600 dark:text-gray-300">Mon-Fri: 9am - 6pm GMT</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">🚀 Free Consultation</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Book a free 30-minute call to discuss your automation needs. No obligation, no pushy sales.</p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">⚡ Quick Response</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">We typically respond within 2 hours during business hours.</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div className="card text-center py-16">
                  <div className="text-6xl mb-6">✅</div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Message Received!</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Thank you for getting in touch. We will be in contact within 2 hours.</p>
                  <button onClick={() => setStatus('idle')} className="btn btn-primary">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Book a Free Consultation</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                      <input name="name" value={formData.name} onChange={handleChange} required placeholder="John Smith" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@business.com" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                      <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+44 7700 000000" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                      <input name="company" value={formData.company} onChange={handleChange} placeholder="Your Business Ltd" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Service Interested In</label>
                    <select name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
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
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tell Us About Your Business *</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Describe your business, current challenges, and what you hope to achieve with AI automation..." className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
                  </div>
                  <button type="submit" disabled={status === 'loading'} className="btn btn-primary w-full py-4 text-lg">
                    {status === 'loading' ? 'Sending...' : 'Send Message & Book Consultation'}
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    By submitting, you agree to our <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>. We never share your data.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div><h4 className="text-white font-bold mb-4">AI-Assist for SMEs</h4><p>Empowering small businesses with AI automation solutions</p></div>
            <div><h4 className="text-white font-bold mb-4">Product</h4><Link href="/services" className="block hover:text-white mb-2">Services</Link><Link href="/pricing" className="block hover:text-white mb-2">Pricing</Link><Link href="/blog" className="block hover:text-white">Blog</Link></div>
            <div><h4 className="text-white font-bold mb-4">Company</h4><Link href="/about" className="block hover:text-white mb-2">About</Link><Link href="/contact" className="block hover:text-white">Contact</Link></div>
            <div><h4 className="text-white font-bold mb-4">Legal</h4><Link href="/privacy" className="block hover:text-white mb-2">Privacy Policy</Link><Link href="/terms" className="block hover:text-white">Terms of Service</Link></div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">© 2026 AI-Assist for SMEs. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
