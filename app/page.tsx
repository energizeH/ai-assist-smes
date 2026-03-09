import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              AI-Assist for SMEs
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
              <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">About</Link>
              <Link href="/services" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">Services</Link>
              <Link href="/plans" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">Pricing</Link>
              <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition">Contact</Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">Login</Link>
              <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Transform Your Business with AI Automation
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Helping SMEs save time, reduce costs, and boost efficiency through intelligent automation solutions
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 font-medium transition text-center">
                Start Free Consultation
              </Link>
              <Link href="/services" className="px-8 py-4 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 text-lg rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition text-center">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Why Choose AI-Assist?</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">We deliver proven results for small and medium businesses</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🚀', title: 'Boost Efficiency', desc: 'Automate repetitive tasks and save up to 20 hours per week' },
              { icon: '💰', title: 'Reduce Costs', desc: 'Cut operational costs by 40% with smart automation' },
              { icon: '📈', title: 'Increase Revenue', desc: 'Improve lead response time and conversion rates' },
            ].map((f, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Our Services</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Comprehensive AI solutions tailored for your business</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🤖', title: 'AI Receptionist System', desc: '24/7 automated customer support with chatbots and voice AI', link: '/services' },
              { icon: '⚙️', title: 'Workflow Automation', desc: 'Streamline invoicing, scheduling, and order processing', link: '/services' },
              { icon: '📧', title: 'AI Email Systems', desc: 'Automated follow-ups and intelligent lead management', link: '/services' },
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{s.desc}</p>
                <Link href={s.link} className="text-blue-600 dark:text-blue-400 hover:underline">Learn more →</Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">View All Services</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Book a free consultation and discover how AI can help your SME grow</p>
          <Link href="/contact" className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 font-medium transition">Get Free Consultation</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">AI-Assist for SMEs</h4>
              <p className="text-gray-400">Empowering small businesses with AI automation solutions</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
                <li><Link href="/plans" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link href="/support" className="hover:text-white transition">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 AI-Assist for SMEs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
