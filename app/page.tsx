import Link from 'next/link'
import LegalFooter from './components/LegalFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Transform Your Business with AI Automation',
  description: 'AI-Assist for SMEs helps UK small businesses save time, reduce costs, and boost efficiency with AI-powered workflow automation, chatbots, and CRM. Plans from £49/month.',
}


export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Navigation */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold gradient-text">
              AI-Assist for SMEs
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-white font-semibold transition">Home</Link>
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
      <section className="section-gradient relative py-24 overflow-hidden">
        <div className="orb orb-blue w-96 h-96 -top-48 -left-48" />
        <div className="orb orb-violet w-80 h-80 -bottom-40 -right-40" />
        <div className="orb orb-emerald w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Transform Your Business</span>
              <br />
              <span className="text-[#f1f5f9]">with AI Automation</span>
            </h1>
            <p className="text-xl text-[#94a3b8] mb-10 max-w-2xl mx-auto">
              Helping SMEs save time, reduce costs, and boost efficiency through intelligent automation solutions
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/contact" className="btn btn-primary text-lg px-8 py-4 text-center">
                Start Free Consultation
              </Link>
              <Link href="/services" className="btn btn-outline text-lg px-8 py-4 text-center">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4"><span className="gradient-text">Why Choose AI-Assist?</span></h2>
          <p className="text-center text-[#94a3b8] mb-12">We deliver proven results for small and medium businesses</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🚀', title: 'Boost Efficiency', desc: 'Automate repetitive tasks and save up to 20 hours per week' },
              { icon: '💰', title: 'Reduce Costs', desc: 'Cut operational costs by 40% with smart automation' },
              { icon: '📈', title: 'Increase Revenue', desc: 'Improve lead response time and conversion rates' },
            ].map((f, i) => (
              <div key={i} className={`glass-card text-center p-8 animate-fadeIn stagger-${i + 1}`}>
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold text-[#f1f5f9] mb-2">{f.title}</h3>
                <p className="text-[#94a3b8]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Help */}
      <section className="section-darker py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4"><span className="gradient-text">Who We Help</span></h2>
          <p className="text-center text-[#94a3b8] mb-12">AI automation solutions tailored for your industry</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🍽️', industry: 'Restaurants & Hospitality', desc: 'Automate bookings, reduce no-shows, and handle customer enquiries 24/7.' },
              { icon: '🔧', industry: 'Trades & Construction', desc: 'Streamline job scheduling, invoicing, and customer follow-ups.' },
              { icon: '🏠', industry: 'Estate Agents', desc: 'Automate lead follow-up, viewings, and client communications.' },
              { icon: '⚖️', industry: 'Solicitors & Legal', desc: 'Handle client intake, document chasing, and appointment booking automatically.' },
              { icon: '🛒', industry: 'E-commerce & Retail', desc: 'Automate order updates, customer service, and abandoned cart recovery.' },
              { icon: '💊', industry: 'Health & Wellness', desc: 'Manage appointment reminders, patient follow-ups, and booking systems.' },
            ].map((item, i) => (
              <div key={i} className={`glass-card p-6 animate-fadeIn stagger-${i + 1}`}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">{item.industry}</h3>
                <p className="text-[#94a3b8] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4"><span className="gradient-text">Our Services</span></h2>
          <p className="text-center text-[#94a3b8] mb-12">Comprehensive AI solutions tailored for your business</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🤖', title: 'AI Receptionist System', desc: '24/7 automated customer support with chatbots and voice AI', link: '/services#ai-receptionist' },
              { icon: '⚙️', title: 'Workflow Automation', desc: 'Streamline invoicing, scheduling, and order processing', link: '/services#workflow-automation' },
              { icon: '📧', title: 'AI Email Systems', desc: 'Automated follow-ups and intelligent lead management', link: '/services#ai-email' },
            ].map((s, i) => (
              <div key={i} className={`glass-card p-6 animate-fadeIn stagger-${i + 1}`}>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="text-xl font-semibold text-[#f1f5f9] mb-2">{s.title}</h3>
                <p className="text-[#94a3b8] mb-4">{s.desc}</p>
                <Link href={s.link} className="text-[#60a5fa] hover:text-white transition font-medium">Learn more →</Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/services" className="btn btn-primary">View All Services</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-darker py-20 relative overflow-hidden">
        <div className="orb orb-blue w-72 h-72 -top-36 right-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-4"><span className="gradient-text">How It Works</span></h2>
          <p className="text-center text-[#94a3b8] mb-12">Four simple steps to transform your business</p>
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

      {/* Testimonials */}
      <section className="py-20 section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4"><span className="gradient-text">What Our Clients Say</span></h2>
          <p className="text-center text-[#94a3b8] mb-12">Real results from real UK businesses</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Mark Reynolds',
                role: 'Operations Manager',
                company: 'Reynolds & Sons Plumbing, Birmingham',
                quote: 'Since implementing AI-Assist, we\'ve cut our admin time by 15 hours a week. The automated scheduling alone has eliminated double-bookings entirely, and our customer response time went from 4 hours to under 10 minutes. It\'s genuinely transformed how we run the business.',
              },
              {
                name: 'Priya Sharma',
                role: 'Owner',
                company: 'Sharma Dental Practice, Leicester',
                quote: 'We were losing £2,000 a month to no-shows before AI-Assist. Their reminder system reduced our no-show rate by 78%, and the AI receptionist handles after-hours enquiries brilliantly. We\'ve taken on 30% more patients without hiring extra staff.',
              },
              {
                name: 'David Collins',
                role: 'Director',
                company: 'Collins Estate Agents, Coventry',
                quote: 'The lead follow-up automation is a game-changer. We used to lose leads because we couldn\'t respond fast enough — now every enquiry gets an instant, personalised response. Our conversion rate has jumped from 12% to 23% in just three months.',
              },
            ].map((t, i) => (
              <div key={i} className={`glass-card p-6 animate-fadeIn stagger-${i + 1}`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <span key={s} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-[#94a3b8] mb-6 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="font-semibold text-[#f1f5f9]">{t.name}</div>
                  <div className="text-[#64748b] text-sm">{t.role}</div>
                  <div className="text-[#64748b] text-sm">{t.company}</div>
                </div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Business?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Book a free consultation and discover how AI can help your SME grow</p>
          <Link href="/contact" className="inline-block bg-white text-[#3b82f6] font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition shadow-lg">Get Free Consultation</Link>
        </div>
      </section>

      <LegalFooter />
    </div>
  )
}
