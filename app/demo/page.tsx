'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

type Message = {
  sender: 'user' | 'bot'
  text: string
  timestamp: Date
}

export default function DemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Hi! I'm your AI Receptionist. I can help you learn more about AI-Assist for SMEs, book a consultation, or answer any questions about our automation services. How can I help you today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg: Message = {
      sender: 'user',
      text: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()

      const botMsg: Message = {
        sender: 'bot',
        text: data.text,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMsg])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'I apologize, but I encountered a technical glitch. Please try again or book a call with our team for immediate assistance!',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#020817', color: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(2,8,23,0.5)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
            &larr; Back to Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '0.5rem', height: '0.5rem', background: '#22c55e', borderRadius: '50%' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0' }}>AI Receptionist Live Demo</span>
          </div>
          <Link
            href="/register"
            style={{ background: '#4f46e5', color: 'white', padding: '0.375rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Chat Area */}
      <main style={{ flex: 1, maxWidth: '56rem', width: '100%', margin: '0 auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', marginBottom: '6rem' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '85%', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700,
                background: msg.sender === 'user' ? '#4f46e5' : '#1e293b',
                border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)'
              }}>
                {msg.sender === 'user' ? 'U' : 'AI'}
              </div>
              <div style={{
                padding: '1rem', borderRadius: msg.sender === 'user' ? '1rem 0 1rem 1rem' : '0 1rem 1rem 1rem', fontSize: '0.875rem', lineHeight: '1.6',
                background: msg.sender === 'user' ? '#4f46e5' : '#0f172a',
                border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: msg.sender === 'user' ? 'white' : '#e2e8f0'
              }}>
                {msg.text}
                <div style={{ fontSize: '0.625rem', marginTop: '0.5rem', opacity: 0.5, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '85%' }}>
              <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>AI</div>
              <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '0 1rem 1rem 1rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <span style={{ width: '0.5rem', height: '0.5rem', background: '#6366f1', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                <span style={{ width: '0.5rem', height: '0.5rem', background: '#6366f1', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }} />
                <span style={{ width: '0.5rem', height: '0.5rem', background: '#6366f1', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(2,8,23,0.8)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about our AI services..."
            disabled={isLoading}
            style={{ flex: 1, background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'white', outline: 'none' }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{ background: '#4f46e5', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer', opacity: (isLoading || !input.trim()) ? 0.5 : 1 }}
          >
            Send
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.625rem', color: '#64748b', marginTop: '0.75rem' }}>
          AI Receptionist powered by GPT-4o-mini, specialized in SME automation.
        </p>
      </div>
    </div>
  )
}
