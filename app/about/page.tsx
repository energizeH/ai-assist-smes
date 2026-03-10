import Link from 'next/link'
import LegalFooter from '../components/LegalFooter'

export default function AboutPage() {
  const team = [
    { name: 'Hassan A.', role: 'Founder & CEO', bio: 'AI automation expert with 10+ years helping SMEs grow through technology.', emoji: '👨‍💼' },
    { name: 'Sarah M.', role: 'Head of Automation', bio: 'Former tech lead specialising in workflow automation and AI integration.', emoji: '👩‍💻' },
    { name: 'James O.', role: 'Client Success Manager', bio: 'Dedicated to helping businesses get maximum ROI from their AI systems.', emoji: '🤝' },
  ]

  const values = [
    { title: 'Innovation First', desc: 'We stay ahead of AI trends to bring you the most effective solutions.', icon: '🚀' },
    { title: 'Client Focused', desc: 'Every solution is tailored to your specific business needs and goals.', icon: '🎯' },
    { title: 'Transparency', desc: 'No jargon, no hidden fees — just clear results you can measure.', icon: '💡' },
    { title: 'Long-term Partnership', desc: 'We grow with you, providing ongoing support as your business scales.', icon: '🤲' },
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">AI-Assist for SMEs</Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">Home</Link>
              <Link href="/about" className="text-primary-600 font-semibold">About</Link>
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
      <section className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">About AI-Assist</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We are a UK-based AI automation consultancy helping small and medium businesses save time, reduce costs, and grow faster through intelligent technology.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                AI should not be reserved for large corporations. We believe every SME deserves access to powerful automation tools that level the playing field.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Founded in Birmingham, UK, AI-Assist for SMEs was born from the frustration of seeing small businesses lose time and money on manual tasks that technology could solve.
              </p>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary-600">150+</div>
                  <div className="text-gray-600 dark:text-gray-300">Clients Served</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600">40%</div>
                  <div className="text-gray-600 dark:text-gray-300">Avg Cost Reduction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600">98%</div>
                  <div className="text-gray-600 dark:text-gray-300">Client Satisfaction</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-2xl p-12 text-center">
              <div className="text-8xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-primary-700 dark:text-primary-300 mb-4">AI That Works For You</h3>
              <p className="text-primary-600 dark:text-primary-400">Not the other way around. We simplify AI so your team can focus on what matters most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">Our Values</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12">The principles that guide everything we do</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="card text-center">
                <div className="text-5xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{v.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">Meet the Team</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12">The people behind your AI transformation</p>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="card text-center">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <div className="text-primary-600 font-medium mb-3">{member.role}</div>
                <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Work With Us?</h2>
          <p className="text-xl text-primary-100 mb-8">Book a free 30-minute consultation and see how we can transform your business</p>
          <Link href="/contact" className="bg-white text-primary-600 font-bold px-8 py-4 rounded-lg hover:bg-primary-50 transition text-lg">Get Free Consultation</Link>
        </div>
      </section>

      <LegalFooter />
    </div>
  )
}
