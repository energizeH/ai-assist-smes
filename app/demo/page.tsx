'use client'

import Link from 'next/link'
import { useState } from 'react'

type Message = { sender: 'user' | 'bot', text: string, timestamp: Date }

export default function DemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hi! I\'m your AI Receptionist. How can I help you today?', timestamp: new Date() },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const botResponses = {
    booking: 'I can help you book an appointment! What date and time works best for you?',
    hours: 'We are open Monday to Friday, 9am to 6pm GMT. How else can I assist you?',
    services: 'We offer AI Receptionist Systems, Workflow Automation, AI Email, Business Analytics, WhatsApp Automation, and Custom Solutions. Which interests you?',
    pricing: 'Our pricing starts from £149/month depending on your needs. Would you like to speak with our team about a custom quote?',
    demo: 'You\'re already trying the demo! This AI can handle customer enquiries, book appointments, answer FAQs, and escalate complex queries to humans.',
    default: 'That\'s a great question! Let me connect you with a human team member who can provide more details. Would you like me to schedule a call?',
  }

  const getBotResponse = (userText: string): string => {
    const lower = userText.toLowerCase()
    if (lower.includes('book') || lower.includes('appointment')) return botResponses.booking
    if (lower.includes('hours') || lower.includes('open') || lower.includes('time')) return botResponses.hours
    if (lower.includes('service') || lower.includes('offer')) return botResponses.services
    if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing')) return botResponses.pricing
    if (lower.includes('demo') || lower.includes('try')) return botResponses.demo
    return botResponses.default
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: Message = { sender: 'user', text: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const botMsg: Message = { sender: 'bot', text: getBotResponse(input), timestamp: new Date() }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">AI-Assist for SMEs</Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">Home</Link>
              <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">About</Link>
              <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">Services</Link>
              <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">Pricing</Link>
              <Link href="/blog" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">Blog</Link>
              <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">Contact</Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="btn btn-secondary">Login</Link>
              <Link href="/register" className="btn btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">🤖 Try Our AI Receptionist</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">See how an AI assistant can handle customer enquiries instantly</p>
          </div>

          <div className="card max-w-3xl mx-auto">
            {/* Chat Messages */}
            <div className="h-[500px] overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'}`}>
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {msg.timestamp.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl">
                    <span className="text-gray-500">Typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button onClick={handleSend} className="btn btn-primary px-8">Send</button>
            </div>

            {/* Quick Prompts */}
            <div className="mt-4 flex flex-wrap gap-2">
              {['Book appointment', 'Opening hours', 'Your services', 'Pricing'].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); handleSend(); setInput(''); }}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-primary-100 dark:hover:bg-primary-900 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: '⚡', title: 'Instant Responses', desc: 'Answers customer queries 24/7 without delay' },
              { icon: '📅', title: 'Smart Booking', desc: 'Handles appointment scheduling automatically' },
              { icon: '🤝', title: 'Human Handoff', desc: 'Seamlessly escalates complex questions to your team' },
            ].map(f => (
              <div key={f.title} className="card text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12 card max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Get Your Own AI Receptionist?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Set up takes less than 48 hours. No coding required.</p>
            <Link href="/contact" className="btn btn-primary text-lg px-8 py-4">Book Free Consultation</Link>
          </div>
        </div>
      </div>

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
