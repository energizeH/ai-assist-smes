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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder for form submission
    console.log('Support request submitted:', formData)
    alert('Thank you for contacting us! We\'ll get back to you soon.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Support Center</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">We're here to help you get the most out of AI-Assist</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Support Resources */}
            <div className="space-y-6">
              {/* Quick Help */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">📧</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Support</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Get help from our support team</p>
                    <a href="mailto:support@ai-assist-smes.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                      support@ai-assist-smes.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Live Chat */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">💬</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Live Chat</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Chat with us in real-time</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Available Mon-Fri, 9am-5pm GMT</p>
                  </div>
                </div>
              </div>

              {/* Documentation */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">📚</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Documentation</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Browse our knowledge base</p>
                    <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                      View Guides →
                    </Link>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">❓</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">FAQs</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Find answers to common questions</p>
                    <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                      Browse FAQs →
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
