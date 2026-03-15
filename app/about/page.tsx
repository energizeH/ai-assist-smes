import Link from 'next/link'
import LegalFooter from '../components/LegalFooter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'AI-Assist for SMEs is a Birmingham-based AI automation consultancy helping UK small businesses transform their operations with intelligent automation solutions.',
}


export default function AboutPage() {
  const team = [
    { name: 'Hassan Ahmed', role: 'Founder & CEO', bio: 'AI automation expert with 10+ years helping SMEs grow through technology.', avatar: 'https://ui-avatars.com/api/?name=Hassan+Ahmed&size=200&background=0D8ABC&color=fff' },
    { name: 'Sarah Mitchell', role: 'Head of Automation', bio: 'Former tech lead specialising in workflow automation and AI integration.', avatar: 'https://ui-avatars.com/api/?name=Sarah+Mitchell&size=200&background=0D8ABC&color=fff' },
    { name: 'James Okafor', role: 'Client Success Manager', bio: 'Dedicated to helping businesses get maximum ROI from their AI systems.', avatar: 'https://ui-avatars.com/api/?name=James+Okafor&size=200&background=0D8ABC&color=fff' },
  ]

  const values = [
    { title: 'Innovation First', desc: 'We stay ahead of AI trends to bring you the most effective solutions.', icon: '🚀' },
    { title: 'Client Focused', desc: 'Every solution is tailored to your specific business needs and goals.', icon: '🎯' },
    { title: 'Transparency', desc: 'No jargon, no hidden fees — just clear results you can measure.', icon: '💡' },
    { title: 'Long-term Partnership', desc: 'We grow with you, providing ongoing support as your business scales.', icon: '🤲' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Navigation */}
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold gradient-text">AI-Assist for SMEs</Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-[#94a3b8] hover:text-white transition">Home</Link>
              <Link href="/about" className="text-white font-semibold transition">About</Link>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">About AI-Assist</span>
          </h1>
          <p className="text-xl text-[#94a3b8] max-w-3xl mx-auto">
            We are a UK-based AI automation consultancy helping small and medium businesses save time, reduce costs, and grow faster through intelligent technology.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#f1f5f9] mb-6">Our Mission</h2>
              <p className="text-lg text-[#94a3b8] mb-6">
                AI should not be reserved for large corporations. We believe every SME deserves access to powerful automation tools that level the playing field.
              </p>
              <p className="text-lg text-[#94a3b8] mb-8">
                Founded in Birmingham, UK, AI-Assist for SMEs was born from the frustration of seeing small businesses lose time and money on manual tasks that technology could solve.
              </p>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="animate-fadeIn stagger-1">
                  <div className="text-3xl font-bold gradient-text">150+</div>
                  <div className="text-[#94a3b8]">Clients Served</div>
                </div>
                <div className="animate-fadeIn stagger-2">
                  <div className="text-3xl font-bold gradient-text">40%</div>
                  <div className="text-[#94a3b8]">Avg Cost Reduction</div>
                </div>
                <div className="animate-fadeIn stagger-3">
                  <div className="text-3xl font-bold gradient-text">98%</div>
                  <div className="text-[#94a3b8]">Client Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="glass-card-strong p-12 text-center">
              <div className="text-8xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-[#f1f5f9] mb-4">AI That Works For You</h3>
              <p className="text-[#94a3b8]">Not the other way around. We simplify AI so your team can focus on what matters most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 section-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4"><span className="gradient-text">Our Values</span></h2>
          <p className="text-center text-[#94a3b8] mb-12">The principles that guide everything we do</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={v.title} className={`glass-card text-center p-8 animate-fadeIn stagger-${i + 1}`}>
                <div className="text-5xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold text-[#f1f5f9] mb-3">{v.title}</h3>
                <p className="text-[#94a3b8]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 section-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4"><span className="gradient-text">Meet the Team</span></h2>
          <p className="text-center text-[#94a3b8] mb-12">The people behind your AI transformation</p>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div key={member.name} className={`glass-card text-center p-8 animate-fadeIn stagger-${i + 1}`}>
                <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-lg ring-2 ring-[#3b82f6]/30" />
                <h3 className="text-xl font-bold text-[#f1f5f9] mb-1">{member.name}</h3>
                <div className="gradient-text font-medium mb-3">{member.role}</div>
                <p className="text-[#94a3b8]">{member.bio}</p>
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Work With Us?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">Book a free 30-minute consultation and see how we can transform your business</p>
          <Link href="/contact" className="inline-block bg-white text-[#3b82f6] font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition shadow-lg">Get Free Consultation</Link>
        </div>
      </section>

      <LegalFooter />
    </div>
  )
}
