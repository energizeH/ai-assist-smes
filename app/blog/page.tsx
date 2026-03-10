import Link from 'next/link'
import LegalFooter from '../components/LegalFooter'

const posts = [
  {
    id: 1,
    title: '5 Ways AI Can Save Your Small Business 20 Hours Per Week',
    excerpt: 'Discover the top automation strategies that UK SMEs are using to eliminate manual tasks and reclaim their time.',
    category: 'Productivity',
    readTime: '5 min read',
    date: 'January 15, 2026',
    author: 'Hassan A.',
    emoji: '⏰',
    featured: true,
  },
  {
    id: 2,
    title: 'The Complete Guide to AI Receptionists for UK Businesses',
    excerpt: 'Everything you need to know about setting up an AI receptionist that handles bookings, FAQs, and customer enquiries 24/7.',
    category: 'AI Receptionist',
    readTime: '8 min read',
    date: 'January 10, 2026',
    author: 'Sarah M.',
    emoji: '🤖',
    featured: true,
  },
  {
    id: 3,
    title: 'How a Birmingham Barbershop Increased Bookings by 40% with AI',
    excerpt: 'A real case study of how a local barbershop implemented AI automation and transformed their customer experience.',
    category: 'Case Study',
    readTime: '6 min read',
    date: 'January 5, 2026',
    author: 'James O.',
    emoji: '✂️',
    featured: false,
  },
  {
    id: 4,
    title: 'WhatsApp Business API: The SME Guide for 2026',
    excerpt: 'How to leverage WhatsApp for business communication, appointment reminders, and customer service automation.',
    category: 'WhatsApp',
    readTime: '7 min read',
    date: 'December 28, 2025',
    author: 'Hassan A.',
    emoji: '💬',
    featured: false,
  },
  {
    id: 5,
    title: 'Reducing No-Shows: How Automated Reminders Can Save Your Business',
    excerpt: 'The true cost of no-shows and how AI-powered reminder systems are helping service businesses recover thousands per month.',
    category: 'Automation',
    readTime: '4 min read',
    date: 'December 20, 2025',
    author: 'Sarah M.',
    emoji: '📊',
    featured: false,
  },
  {
    id: 6,
    title: 'AI Email Marketing: Beyond MailChimp for SMEs',
    excerpt: 'Why intelligent email automation outperforms traditional email marketing and how to implement it for your business.',
    category: 'Email Marketing',
    readTime: '6 min read',
    date: 'December 15, 2025',
    author: 'James O.',
    emoji: '📧',
    featured: false,
  },
]

const categories = ['All', 'Productivity', 'AI Receptionist', 'Case Study', 'WhatsApp', 'Automation', 'Email Marketing']

export default function BlogPage() {
  const featured = posts.filter(p => p.featured)
  const rest = posts.filter(p => !p.featured)

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
              <Link href="/plans" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">Pricing</Link>
              <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">Contact</Link>
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
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">AI Automation Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Practical guides, case studies, and insights for UK small businesses adopting AI
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {featured.map((post) => (
              <div key={post.id} className="card hover:shadow-xl transition-all duration-300">
                <div className="text-6xl mb-4">{post.emoji}</div>
                <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">{post.category}</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 ">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                cat === 'All' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900'
              }`}>{cat}</button>
            ))}
          </div>

          {/* All Posts */}
          <div className="grid md:grid-cols-3 gap-8">
            {rest.map((post) => (
              <div key={post.id} className="card hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">{post.emoji}</div>
                <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">{post.category}</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 ">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary-600">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">📨 Get AI Tips in Your Inbox</h2>
          <p className="text-xl text-primary-100 mb-8">Weekly insights on AI automation for UK small businesses. No spam, unsubscribe any time.</p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none" />
            <button className="bg-white text-primary-600 font-bold px-6 py-3 rounded-lg hover:bg-primary-50 transition whitespace-nowrap">Subscribe</button>
          </div>
        </div>
      </section>

      <LegalFooter />
    </div>
  )
}
