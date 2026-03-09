'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, Loader2, ArrowLeft } from 'lucide-react'

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
    messagesEndRef.current?.scrollIntoView({ behavior: \"smooth\" })
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
        text: \"I apologize, but I encountered a technical glitch. Please try again or book a call with our team for immediate assistance!\",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className=\"min-h-screen bg-slate-950 text-white flex flex-col\">
      {/* Header */}
      <header className=\"border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10\">
        <div className=\"max-w-4xl mx-auto px-4 h-16 flex items-center justify-between\">
          <Link href=\"/\" className=\"flex items-center gap-2 text-slate-400 hover:text-white transition-colors\">
            <ArrowLeft size={20} />
            <span className=\"text-sm font-medium\">Back to Home</span>
          </Link>
          <div className=\"flex items-center gap-2\">
            <div className=\"w-2 h-2 bg-green-500 rounded-full animate-pulse\" />
            <span className=\"text-sm font-semibold tracking-tight text-slate-200\">AI Receptionist Live Demo</span>
          </div>
          <Link 
            href=\"/register\" 
            className=\"bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-indigo-500/20\"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Chat Area */}
      <main className=\"flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-6 overflow-y-auto mb-24\">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-800 border border-white/10'
              }`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} className=\"text-indigo-400\" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
              }`}>
                {msg.text}
                <div className={`text-[10px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className=\"flex justify-start animate-in fade-in duration-300\">
            <div className=\"flex gap-3 max-w-[85%]\">
              <div className=\"w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center\">
                <Bot size={16} className=\"text-indigo-400\" />
              </div>
              <div className=\"bg-slate-900 border border-white/10 p-4 rounded-2xl rounded-tl-none\">
                <Loader2 size={18} className=\"animate-spin text-indigo-400\" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className=\"fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 p-4\">
        <div className=\"max-w-4xl mx-auto flex gap-3\">
          <input
            type=\"text\"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => ea.key === 'Enter' && handleSend()}
            placeholder=\"Ask anything about our AI services...\"
            className=\"flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-slate-500 transition-all\"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className=\"bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20\"
          >
            <Send size={20} />
          </button>
        </div>
        <p className=\"text-center text-[10px] text-slate-500 mt-3\">
          Our AI Receptionist is powered by GPT-4o-mini and specialized in SME automation.
        </p>
      </div>
    </div>
  )
}
