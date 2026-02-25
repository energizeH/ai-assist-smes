import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              AI-Assist for SMEs
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition">Home</Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 transition">About</Link>
              <Link href="/services" className="text-gray-700 hover:text-primary-600 transition">Services</Link>
              <Link href="/pricing" className="text-gray-700 hover:text-primary-600 transition">Pricing</Link>
              <Link href="/blog" className="text-gray-700 hover:text-primary-600 transition">Blog</Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition">Contact</Link>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="btn btn-secondary">Login</Link>
              <Link href="/register" className="btn btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your Business with AI Automation
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Helping SMEs save time, reduce costs, and boost efficiency through intelligent automation solutions
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/register" className="btn btn-primary text-lg px-8 py-4">
                Start Free Consultation
              </Link>
              <Link href="/services" className="btn btn-outline text-lg px-8 py-4">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose AI-Assist?</h2>
            <p className="text-xl text-gray-600">We deliver proven results for small and medium businesses</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2">Boost Efficiency</h3>
              <p className="text-gray-600">Automate repetitive tasks and save up to 20 hours per week</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Reduce Costs</h3>
              <p className="text-gray-600">Cut operational costs by 40% with smart automation</p>
            </div>
            <div className="card text-center">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-2">Increase Revenue</h3>
              <p className="text-gray-600">Improve lead response time and conversion rates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive AI solutions tailored for your business</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card hover:border-primary-600 border-2 border-transparent transition">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3">AI Receptionist System</h3>
              <p className="text-gray-600 mb-4">24/7 automated customer support with chatbots and voice AI</p>
              <Link href="/services" className="text-primary-600 font-medium hover:underline">Learn more →</Link>
            </div>
            <div className="card hover:border-primary-600 border-2 border-transparent transition">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold mb-3">Workflow Automation</h3>
              <p className="text-gray-600 mb-4">Streamline invoicing, scheduling, and order processing</p>
              <Link href="/services" className="text-primary-600 font-medium hover:underline">Learn more →</Link>
            </div>
            <div className="card hover:border-primary-600 border-2 border-transparent transition">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-bold mb-3">AI Email Systems</h3>
              <p className="text-gray-600 mb-4">Automated follow-ups and intelligent lead management</p>
              <Link href="/services" className="text-primary-600 font-medium hover:underline">Learn more →</Link>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/services" className="btn btn-primary">View All Services</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 opacity-90">Book a free consultation and discover how AI can help your SME grow</p>
          <Link href="/contact" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-block">
            Get Free Consultation
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">AI-Assist for SMEs</h4>
              <p className="text-gray-400">Empowering small businesses with AI automation solutions</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <div className="space-y-2">
                <Link href="/services" className="block text-gray-400 hover:text-white">Services</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white">Pricing</Link>
                <Link href="/blog" className="block text-gray-400 hover:text-white">Blog</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-400 hover:text-white">About</Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white">Privacy Policy</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 AI-Assist for SMEs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
