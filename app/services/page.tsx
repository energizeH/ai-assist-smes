import Link from 'next/link'
import LegalFooter from '../components/LegalFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'AI chatbots, workflow automation, CRM, lead management, email systems, and appointment scheduling — all powered by AI and built for UK SMEs.',
}


const services = [
  {
    id: 'ai-receptionist',
    icon: '🤖',
    title: 'AI Receptionist System',
    tagline: '24/7 Automated Customer Support',
    desc: 'Never miss a customer enquiry again. Our AI receptionist handles calls, chats, and WhatsApp messages around the clock, booking appointments, answering FAQs, and routing complex queries to your team.',
    features: ['24/7 availability', 'Multi-channel support', 'Appointment booking', 'FAQ automation', 'Seamless handover to staff', 'CRM integration'],
    price: 'From £299/month',
    cta: 'Get Started',
    link: '/plans',
  },
  {
    id: 'workflow-automation',
    icon: '⚙️',
    title: 'Workflow Automation',
    tagline: 'Eliminate Repetitive Manual Tasks',
    desc: 'Automate your invoicing, order processing, inventory management, and scheduling. Connect your existing tools with intelligent automation that works in the background so your team can focus on growth.',
    features: ['Invoice automation', 'Order processing', 'Inventory sync', 'Staff scheduling', 'Report generation', 'Multi-system integration'],
    price: 'From £49/month',
    cta: 'Learn More',
    link: '/contact',
  },
  {
    id: 'ai-email',
    icon: '📧',
    title: 'AI Email Systems',
    tagline: 'Intelligent Lead Management',
    desc: 'Turn every lead into a customer with AI-powered email follow-ups, personalised campaigns, and smart inbox management. Our system qualifies leads, books calls, and nurtures relationships automatically.',
    features: ['Automated follow-ups', 'Lead scoring', 'Personalised campaigns', 'Smart inbox triage', 'A/B testing', 'Analytics dashboard'],
    price: 'From £49/month',
    cta: 'See How It Works',
    link: '/contact',
  },
  {
    id: 'analytics',
    icon: '📊',
    title: 'Business Intelligence & Analytics',
    tagline: 'Data-Driven Decision Making',
    desc: 'Stop guessing and start knowing. Our AI analytics platform transforms your raw business data into actionable insights, helping you identify opportunities, spot problems early, and make better decisions faster.',
    features: ['Real-time dashboards', 'Sales forecasting', 'Customer insights', 'Performance tracking', 'Automated reports', 'KPI monitoring'],
    price: 'From £49/month',
    cta: 'View Dashboard',
    link: '/plans',
  },
  {
    id: 'whatsapp',
    icon: '💬',
    title: 'WhatsApp Business Automation',
    tagline: 'Engage Customers Where They Are',
    desc: 'Leverage the UK\'s most popular messaging app for your business. Send appointment reminders, order updates, promotional campaigns, and handle customer service through WhatsApp with AI automation.',
    features: ['Bulk messaging', 'Appointment reminders', 'Order updates', 'Customer service bot', 'Media sharing', 'Click-to-chat campaigns'],
    price: 'From £49/month',
    cta: 'Get Started',
    link: '/register',
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
  },
]

export default function ServicesPage() {
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
              <Link href="/services" className="text-white font-semibold transition">Services</Link>
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
      <section className="section-gradient relative py-24 overflow-hidden">
        <div className="orb orb-violet w-96 h-96 -top-48 -right-48" />
        <div className="orb orb-blue w-72 h-72 -bottom-36 -left-36" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Our Services</span>
          </h1>
          <p className="text-xl text-[#94a3b8] max-w-3xl mx-auto">
            Comprehensive AI automation solutions designed specifically for small and medium businesses
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {services.map((service, i) => (
              <div key={service.id} id={service.id} className={`glass-card p-8 scroll-mt-24 animate-fadeIn stagger-${(i % 6) + 1}`}>
                <div className="text-4xl mb-4">{service.icon}</div>
                <h2 className="text-2xl font-bold text-[#f1f5f9] mb-1">{service.title}</h2>
                <p className="gradient-text font-semibold mb-4">{service.tagline}</p>
                <p className="text-[#94a3b8] mb-6">{service.desc}</p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {service.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-[#94a3b8]">
                      <span className="text-[#10b981]">✓</span>{f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xl font-bold text-[#f1f5f9]">{service.price}</span>
                  <Link href={service.link} className="btn btn-primary">{service.cta}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-darker py-20 relative overflow-hidden">
        <div className="orb orb-emerald w-64 h-64 -top-32 right-0 opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-4"><span className="gradient-text">How We Work</span></h2>
          <p className="text-center text-[#94a3b8] mb-12">Simple 4-step process to transform your business</p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery Call', desc: 'We learn about your business, challenges, and goals in a free 30-minute consultation.' },
              { step: '02', title: 'Custom Plan', desc: 'We design a tailored automation roadmap specifically for your business needs and budget.' },
              { step: '03', title: 'Build & Deploy', desc: 'Our team builds and integrates your AI solution, typically within 1-2 weeks.' },
              { step: '04', title: 'Ongoing Support', desc: 'We monitor, optimise, and support your system with regular check-ins and updates.' },
            ].map((item, i) => (
              <div key={item.step} className={`text-center animate-fadeIn stagger-${i + 1}`}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-lg font-bold" style={{ background: 'var(--gradient-cta)' }}>{item.step}</div>
                <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">{item.title}</h3>
                <p className="text-[#94a3b8] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-cta)' }} />
        <div className="orb w-96 h-96 -top-48 -right-48" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <div className="orb w-72 h-72 -bottom-36 -left-36" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Not Sure Which Service You Need?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Book a free consultation and we will recommend the best solution for your business</p>
          <Link href="/contact" className="inline-block bg-white text-[#3b82f6] font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition shadow-lg">Book Free Consultation</Link>
        </div>
      </section>

      <LegalFooter />
    </div>
  )
}
