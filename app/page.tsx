import Link from 'next/link'
import LegalFooter from './components/LegalFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Transform Your Business with AI Automation',
  description: 'AI-Assist for SMEs helps UK small businesses save time, reduce costs, and boost efficiency with AI-powered workflow automation, chatbots, and CRM. Plans from £49/month.',
}


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
              <Link href="/contact" className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 font-medium transition text-center">
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

      {/* Who We Help */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Who We Help</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">AI automation solutions tailored for your industry</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🍽️', industry: 'Restaurants & Hospitality', desc: 'Automate bookings, reduce no-shows, and handle customer enquiries 24/7.' },
              { icon: '🔧', industry: 'Trades & Construction', desc: 'Streamline job scheduling, invoicing, and customer follow-ups.' },
              { icon: '🏠', industry: 'Estate Agents', desc: 'Automate lead follow-up, viewings, and client communications.' },
              { icon: '⚖️', industry: 'Solicitors & Legal', desc: 'Handle client intake, document chasing, and appointment booking automatically.' },
              { icon: '🛒', industry: 'E-commerce & Retail', desc: 'Automate order updates, customer service, and abandoned cart recovery.' },
              { icon: '💊', industry: 'Health & Wellness', desc: 'Manage appointment reminders, patient follow-ups, and booking systems.' },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.industry}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white dark:bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Our Services</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Comprehensive AI solutions tailored for your business</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🤖', title: 'AI Receptionist System', desc: '24/7 automated customer support with chatbots and voice AI', link: '/services#ai-receptionist' },
              { icon: '⚙️', title: 'Workflow Automation', desc: 'Streamline invoicing, scheduling, and order processing', link: '/services#workflow-automation' },
              { icon: '📧', title: 'AI Email Systems', desc: 'Automated follow-ups and intelligent lead management', link: '/services#ai-email' },
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

      {/* How It Works */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Four simple steps to transform your business</p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery Call', desc: 'We learn about your business, challenges, and goals in a free 30-minute consultation.' },
              { step: '02', title: 'Custom Plan', desc: 'We design a tailored automation roadmap specifically for your business needs and budget.' },
              { step: '03', title: 'Build & Deploy', desc: 'Our team builds and integrates your AI solution, typically within 1-2 weeks.' },
              { step: '04', title: 'Ongoing Support', desc: 'We monitor, optimise, and support your system with regular check-ins and updates.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">What Our Clients Say</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12">Real results from real UK businesses</p>
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
              <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <span key={s} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm leading-relaxed">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">{t.role}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">{t.company}</div>
                </div>
              </div>
            ))}
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

      <LegalFooter />
    </div>
  )
}
