import Link from 'next/link'

const services = [
  {
    id: 'ai-receptionist',
    icon: '🤖',
    title: 'AI Receptionist System',
    tagline: '24/7 Automated Customer Support',
    desc: 'Never miss a customer enquiry again. Our AI receptionist handles calls, chats, and WhatsApp messages around the clock, booking appointments, answering FAQs, and routing complex queries to your team.',
    features: ['24/7 availability', 'Multi-channel support', 'Appointment booking', 'FAQ automation', 'Seamless handover to staff', 'CRM integration'],
    price: 'From £79/month',
    cta: 'Get Started',
    link: '/plans',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'workflow',
    icon: '⚙️',
    title: 'Workflow Automation',
    tagline: 'Eliminate Repetitive Manual Tasks',
    desc: 'Automate your invoicing, order processing, inventory management, and scheduling. Connect your existing tools with intelligent automation that works in the background so your team can focus on growth.',
    features: ['Invoice automation', 'Order processing', 'Inventory sync', 'Staff scheduling', 'Report generation', 'Multi-system integration'],
    price: 'From £29/month',
    cta: 'Learn More',
    link: '/contact',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'email-ai',
    icon: '📧',
    title: 'AI Email Systems',
    tagline: 'Intelligent Lead Management',
    desc: 'Turn every lead into a customer with AI-powered email follow-ups, personalised campaigns, and smart inbox management. Our system qualifies leads, books calls, and nurtures relationships automatically.',
    features: ['Automated follow-ups', 'Lead scoring', 'Personalised campaigns', 'Smart inbox triage', 'A/B testing', 'Analytics dashboard'],
    price: 'From £29/month',
    cta: 'See How It Works',
    link: '/contact',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'analytics',
    icon: '📊',
    title: 'Business Intelligence & Analytics',
    tagline: 'Data-Driven Decision Making',
    desc: 'Stop guessing and start knowing. Our AI analytics platform transforms your raw business data into actionable insights, helping you identify opportunities, spot problems early, and make better decisions faster.',
    features: ['Real-time dashboards', 'Sales forecasting', 'Customer insights', 'Performance tracking', 'Automated reports', 'KPI monitoring'],
    price: 'From £29/month',
    cta: 'View Dashboard',
    link: '/plans',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'whatsapp',
    icon: '💬',
    title: 'WhatsApp Business Automation',
    tagline: 'Engage Customers Where They Are',
    desc: 'Leverage the UK\'s most popular messaging app for your business. Send appointment reminders, order updates, promotional campaigns, and handle customer service through WhatsApp with AI automation.',
    features: ['Bulk messaging', 'Appointment reminders', 'Order updates', 'Customer service bot', 'Media sharing', 'Click-to-chat campaigns'],
    price: 'From £29/month',
    cta: 'Get Started',
    link: '/register',
    color: 'from-teal-500 to-teal-600',
  },
  {
    id: 'custom',
    icon: '🔧',
    title: 'Custom AI Solutions',
    tagline: 'Built Specifically For Your Business',
    desc: 'Have a unique challenge? We design bespoke AI solutions from scratch. Whether you need a specialised chatbot, a custom integration, or an entirely new automation system, we build exactly what you need.',
    features: ['Bespoke development', 'API integrations', 'Ongoing support', 'Staff training', 'Dedicated account manager', 'SLA guarantee'],
    price: 'Custom pricing',
    cta: 'Book Consultation',
    link: '/contact',
    color: 'from-red-500 to-red-600',
  },
]

export default function ServicesPage() {
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
              <Link href="/services" className="text-primary-600 font-semibold">Services</Link>
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive AI automation solutions designed specifically for small and medium businesses
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-10">
            {services.map((service) => (
              <div key={service.id} className="card hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center text-3xl mb-6`}>
                  {service.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{service.title}</h2>
                <p className="text-primary-600 font-semibold mb-4">{service.tagline}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{service.desc}</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {service.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-green-500">✓</span>{f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{service.price}</span>
                  <Link href={service.link} className="btn btn-primary">{service.cta}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">How We Work</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12">Simple 4-step process to transform your business</p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery Call', desc: 'We learn about your business, challenges, and goals in a free 30-minute consultation.' },
              { step: '02', title: 'Custom Plan', desc: 'We design a tailored automation roadmap specifically for your business needs and budget.' },
              { step: '03', title: 'Build & Deploy', desc: 'Our team builds and integrates your AI solution, typically within 1-2 weeks.' },
              { step: '04', title: 'Ongoing Support', desc: 'We monitor, optimise, and support your system with regular check-ins and updates.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Not Sure Which Service You Need?</h2>
          <p className="text-xl text-primary-100 mb-8">Book a free consultation and we will recommend the best solution for your business</p>
          <Link href="/contact" className="bg-white text-primary-600 font-bold px-8 py-4 rounded-lg hover:bg-primary-50 transition text-lg">Book Free Consultation</Link>
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
