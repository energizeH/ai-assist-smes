import Link from 'next/link'
import LegalFooter from '../components/LegalFooter'
import NewsletterForm from '../components/NewsletterForm'
import type { Metadata } from 'next'
import { posts } from './posts'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, guides, and tips on AI automation for UK small businesses. Learn how to streamline operations and grow your SME with intelligent tools.',
}

export default function BlogPage() {
  const featured = posts.filter(p => p.featured)
  const rest = posts.filter(p => !p.featured)

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
              <Link href="/contact" className="text-[#94a3b8] hover:text-white transition">Contact</Link>
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
        <div className="orb orb-blue w-80 h-80 -top-40 -left-40" />
        <div className="orb orb-emerald w-64 h-64 -bottom-32 -right-32 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">AI Automation Blog</span>
          </h1>
          <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto">
            Practical guides, case studies, and insights for UK small businesses adopting AI
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#f1f5f9] mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {featured.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className={`glass-card p-6 block hover:border-[#3b82f6]/30 transition-all duration-300 animate-fadeIn stagger-${i + 1}`}>
                <div className="text-6xl mb-4">{post.emoji}</div>
                <span className="inline-block bg-[#3b82f6]/20 text-[#60a5fa] text-xs font-semibold px-3 py-1 rounded-full mb-3">{post.category}</span>
                <h3 className="text-xl font-bold text-[#f1f5f9] mb-3">{post.title}</h3>
                <p className="text-[#94a3b8] mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-[#64748b] pt-4 border-t border-white/10">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* All Posts */}
          <h2 className="text-2xl font-bold text-[#f1f5f9] mb-8">All Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {rest.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className={`glass-card p-6 block hover:border-[#3b82f6]/30 transition-all duration-300 animate-fadeIn stagger-${(i % 6) + 1}`}>
                <div className="text-5xl mb-4">{post.emoji}</div>
                <span className="inline-block bg-white/5 text-[#94a3b8] text-xs font-semibold px-3 py-1 rounded-full mb-3">{post.category}</span>
                <h3 className="text-lg font-bold text-[#f1f5f9] mb-3">{post.title}</h3>
                <p className="text-[#94a3b8] text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-[#64748b] pt-4 border-t border-white/10">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-cta)' }} />
        <div className="orb w-80 h-80 -top-40 -right-40" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">Get AI Tips in Your Inbox</h2>
          <p className="text-xl text-white/80 mb-8">Weekly insights on AI automation for UK small businesses. No spam, unsubscribe any time.</p>
          <NewsletterForm />
        </div>
      </section>

      <LegalFooter />
    </div>
  )
}
