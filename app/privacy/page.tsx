import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How AI-Assist for SMEs collects, uses, and protects your personal data under UK GDPR and the Data Protection Act 2018.',
}


export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <nav className="nav-glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold gradient-text">AI-Assist for SMEs</Link>
            <div className="flex space-x-4">
              <Link href="/login" className="px-4 py-2 text-[#94a3b8] hover:text-white font-medium transition">Login</Link>
              <Link href="/register" className="btn btn-primary text-sm">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-[#f1f5f9] mb-4">Privacy Policy</h1>
        <p className="text-[#64748b] mb-8">Last updated: 10 March 2026</p>

        <div className="glass-card-static p-8 sm:p-10 space-y-8 text-[#94a3b8]">
          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">1. Introduction</h2>
            <p>AI-Assist for SMEs (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our AI automation platform and related services (the &ldquo;Service&rdquo;).</p>
            <p className="mt-2">We are registered in England and Wales. Our registered address is Birmingham, United Kingdom. For the purposes of the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018 (DPA 2018), we are the data controller.</p>
            <p className="mt-2">If you have any questions about this Privacy Policy or our data practices, please contact our Data Protection Officer at <a href="mailto:privacy@aiassistsmes.co.uk" className="text-[#60a5fa] hover:text-[#3b82f6] transition">privacy@aiassistsmes.co.uk</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">2. Information We Collect</h2>
            <p>We collect and process the following categories of personal data:</p>
            <h3 className="text-lg font-semibold text-[#f1f5f9] mt-4 mb-2">2.1 Information You Provide Directly</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-[#f1f5f9]">Account Information:</strong> Full name, email address, company name, phone number, and password when you register for an account.</li>
              <li><strong className="text-[#f1f5f9]">Payment Information:</strong> Billing details processed securely via Stripe. We do not store your full card number on our servers.</li>
              <li><strong className="text-[#f1f5f9]">Communications:</strong> Messages, support requests, and any information you provide when contacting us.</li>
              <li><strong className="text-[#f1f5f9]">Service Data:</strong> Business data you input into our AI tools, chatbot conversations, and automation configurations.</li>
            </ul>
            <h3 className="text-lg font-semibold text-[#f1f5f9] mt-4 mb-2">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-[#f1f5f9]">Technical Data:</strong> IP address, browser type and version, operating system, device information.</li>
              <li><strong className="text-[#f1f5f9]">Usage Data:</strong> Pages visited, features used, time spent on the Service, clickstream data.</li>
              <li><strong className="text-[#f1f5f9]">Cookie Data:</strong> Information collected through cookies and similar technologies (see our <Link href="/cookies" className="text-[#60a5fa] hover:text-[#3b82f6] transition">Cookie Policy</Link>).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">3. Lawful Basis for Processing</h2>
            <p>Under UK GDPR, we process your personal data on the following legal bases:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-[#f1f5f9]">Contract (Article 6(1)(b)):</strong> Processing necessary to perform our contract with you, including providing the Service, managing your account, and processing payments.</li>
              <li><strong className="text-[#f1f5f9]">Legitimate Interests (Article 6(1)(f)):</strong> Processing necessary for our legitimate interests, such as improving our Service, preventing fraud, and ensuring platform security, where those interests are not overridden by your rights.</li>
              <li><strong className="text-[#f1f5f9]">Consent (Article 6(1)(a)):</strong> Where you have given clear consent for us to process your personal data for specific purposes, such as marketing communications and non-essential cookies.</li>
              <li><strong className="text-[#f1f5f9]">Legal Obligation (Article 6(1)(c)):</strong> Processing necessary to comply with legal obligations, such as tax and accounting requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">4. How We Use Your Information</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To create and manage your account</li>
              <li>To provide, maintain, and improve our AI automation services</li>
              <li>To process subscription payments and manage billing</li>
              <li>To send you service-related communications (e.g. account verification, security alerts, subscription updates)</li>
              <li>To provide customer support and respond to your enquiries</li>
              <li>To analyse usage patterns and improve user experience</li>
              <li>To detect, prevent, and address fraud, abuse, and security issues</li>
              <li>To send marketing communications (only with your explicit consent)</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">5. Data Sharing and Third Parties</h2>
            <p>We do not sell your personal data. We share your information only with the following categories of third-party service providers who process data on our behalf:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-[#f1f5f9]">Supabase (Database & Authentication):</strong> Stores your account data and handles authentication. Data is hosted in the EU/UK.</li>
              <li><strong className="text-[#f1f5f9]">Stripe (Payment Processing):</strong> Processes subscription payments securely. Stripe is PCI DSS Level 1 certified.</li>
              <li><strong className="text-[#f1f5f9]">Vercel (Hosting):</strong> Hosts our web application. May process technical data such as IP addresses.</li>
              <li><strong className="text-[#f1f5f9]">Anthropic (AI Processing):</strong> Powers our AI chatbot features. Business data you submit may be processed by Anthropic&apos;s API.</li>
            </ul>
            <p className="mt-2">All third-party processors are bound by data processing agreements and are required to process your data in accordance with UK GDPR.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">6. International Data Transfers</h2>
            <p>Some of our third-party service providers are located outside the United Kingdom. Where personal data is transferred outside the UK, we ensure that appropriate safeguards are in place, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Standard Contractual Clauses (SCCs) approved by the ICO</li>
              <li>UK adequacy regulations where the destination country has been deemed to provide adequate data protection</li>
              <li>Binding Corporate Rules where applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">7. Data Retention</h2>
            <p>We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-[#f1f5f9]">Account data:</strong> Retained for the duration of your account, plus 30 days after deletion to allow for account recovery.</li>
              <li><strong className="text-[#f1f5f9]">Payment records:</strong> Retained for 7 years as required by UK tax law (HMRC requirements).</li>
              <li><strong className="text-[#f1f5f9]">Usage data:</strong> Retained for up to 24 months for analytics purposes, then anonymised or deleted.</li>
              <li><strong className="text-[#f1f5f9]">Support correspondence:</strong> Retained for 3 years after your last interaction with us.</li>
              <li><strong className="text-[#f1f5f9]">Marketing consent records:</strong> Retained for as long as consent is active, plus 3 years after withdrawal.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">8. Your Rights Under UK GDPR</h2>
            <p>Under the UK GDPR and DPA 2018, you have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-[#f1f5f9]">Right of Access (Article 15):</strong> You can request a copy of all personal data we hold about you.</li>
              <li><strong className="text-[#f1f5f9]">Right to Rectification (Article 16):</strong> You can ask us to correct inaccurate or incomplete data.</li>
              <li><strong className="text-[#f1f5f9]">Right to Erasure (Article 17):</strong> You can request deletion of your personal data (&ldquo;right to be forgotten&rdquo;).</li>
              <li><strong className="text-[#f1f5f9]">Right to Restrict Processing (Article 18):</strong> You can ask us to limit how we use your data.</li>
              <li><strong className="text-[#f1f5f9]">Right to Data Portability (Article 20):</strong> You can request your data in a machine-readable format (JSON).</li>
              <li><strong className="text-[#f1f5f9]">Right to Object (Article 21):</strong> You can object to processing based on legitimate interests or direct marketing.</li>
              <li><strong className="text-[#f1f5f9]">Rights Related to Automated Decision-Making (Article 22):</strong> You have the right not to be subject to decisions based solely on automated processing that produce legal or significant effects.</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, please visit your <Link href="/dashboard/settings" className="text-[#60a5fa] hover:text-[#3b82f6] transition">account settings</Link> (for data export and deletion) or email us at <a href="mailto:privacy@aiassistsmes.co.uk" className="text-[#60a5fa] hover:text-[#3b82f6] transition">privacy@aiassistsmes.co.uk</a>. We will respond within one month of receiving your request, as required by law.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">9. Data Security</h2>
            <p>We take the security of your personal data seriously and implement appropriate technical and organisational measures, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Encryption of data in transit (TLS 1.2+) and at rest</li>
              <li>Secure password hashing (bcrypt)</li>
              <li>Role-based access controls</li>
              <li>Regular security reviews and updates</li>
              <li>PCI DSS Level 1 compliant payment processing via Stripe</li>
              <li>Row-level security on all database tables</li>
            </ul>
            <p className="mt-2">In the event of a personal data breach that poses a risk to your rights and freedoms, we will notify the Information Commissioner&apos;s Office (ICO) within 72 hours and inform affected individuals without undue delay.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">10. Cookies</h2>
            <p>We use cookies and similar technologies on our Service. For full details about the cookies we use, why we use them, and how you can control them, please see our <Link href="/cookies" className="text-[#60a5fa] hover:text-[#3b82f6] transition">Cookie Policy</Link>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">11. Children&apos;s Privacy</h2>
            <p>Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal data from children. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information promptly.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">12. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page with a revised &ldquo;Last updated&rdquo; date, and where appropriate, by email notification. We encourage you to review this Privacy Policy periodically.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">13. Complaints</h2>
            <p>If you are unhappy with how we have handled your personal data, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO):</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-[#f1f5f9]">Website:</strong> <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer" className="text-[#60a5fa] hover:text-[#3b82f6] transition">ico.org.uk/make-a-complaint</a></li>
              <li><strong className="text-[#f1f5f9]">Helpline:</strong> 0303 123 1113</li>
              <li><strong className="text-[#f1f5f9]">Post:</strong> Information Commissioner&apos;s Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
            </ul>
            <p className="mt-2">We would appreciate the opportunity to address your concerns before you contact the ICO, so please reach out to us first at <a href="mailto:privacy@aiassistsmes.co.uk" className="text-[#60a5fa] hover:text-[#3b82f6] transition">privacy@aiassistsmes.co.uk</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">14. Contact Us</h2>
            <p>For any questions about this Privacy Policy or to exercise your data protection rights:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-[#f1f5f9]">Email:</strong> <a href="mailto:privacy@aiassistsmes.co.uk" className="text-[#60a5fa] hover:text-[#3b82f6] transition">privacy@aiassistsmes.co.uk</a></li>
              <li><strong className="text-[#f1f5f9]">Address:</strong> AI-Assist for SMEs, Birmingham, United Kingdom</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4">
          <Link href="/" className="text-[#60a5fa] hover:text-[#3b82f6] transition">&larr; Back to Home</Link>
          <Link href="/terms" className="text-[#60a5fa] hover:text-[#3b82f6] transition">Terms of Service</Link>
          <Link href="/cookies" className="text-[#60a5fa] hover:text-[#3b82f6] transition">Cookie Policy</Link>
        </div>
      </div>
    </div>
  )
}
