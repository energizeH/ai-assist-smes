import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Processing Policy | AI-Assist for SMEs',
  description: 'UK GDPR compliant Data Processing Policy for AI-Assist for SMEs, detailing how we process personal data, our sub-processors, security measures, and international data transfers.',
}


export default function DataProcessingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">AI-Assist for SMEs</Link>
            <div className="flex space-x-4">
              <Link href="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium transition">Login</Link>
              <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Data Processing Policy</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: March 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">1. Introduction</h2>
            <p>This Data Processing Policy (&ldquo;Policy&rdquo;) describes how AI-Assist for SMEs (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) processes personal data in connection with our AI automation platform and related services (the &ldquo;Service&rdquo;). This Policy forms part of our commitment to compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018 (DPA 2018).</p>
            <p>For the purposes of data protection law, AI-Assist for SMEs acts as the <strong className="text-gray-800 dark:text-gray-200">data controller</strong> for personal data collected through the Service. This means we determine the purposes and means of processing your personal data.</p>
            <p>This Policy should be read in conjunction with our <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">2. Data Processing Purposes</h2>
            <p>We process personal data for the following specific purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">Service Delivery:</strong> To provide, operate, and maintain our AI automation platform, including user account management, AI chatbot functionality, and automation tools.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Payment Processing:</strong> To process subscription payments, manage billing cycles, issue invoices, and handle refunds.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Communications:</strong> To send transactional emails (account verification, password resets, billing notifications) and, where consented, marketing communications.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Service Improvement:</strong> To analyse usage patterns, diagnose technical issues, and improve the performance and features of the Service.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Security and Fraud Prevention:</strong> To detect, prevent, and respond to security incidents, fraudulent activity, and abuse of the Service.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes, including tax and accounting obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">3. Lawful Basis for Processing</h2>
            <p>We rely on the following lawful bases under Article 6 of the UK GDPR:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">Performance of a Contract (Article 6(1)(b)):</strong> Processing necessary to deliver the Service you have subscribed to, including account creation, service provision, and payment processing.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Legitimate Interests (Article 6(1)(f)):</strong> Processing necessary for our legitimate business interests, such as improving our Service, ensuring security, and preventing fraud, where these interests do not override your fundamental rights and freedoms.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Consent (Article 6(1)(a)):</strong> Processing based on your freely given, specific, informed, and unambiguous consent, such as for marketing communications and non-essential cookies.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Legal Obligation (Article 6(1)(c)):</strong> Processing necessary to comply with our legal obligations, including tax reporting, financial record-keeping, and responding to lawful requests from authorities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">4. Sub-Processors</h2>
            <p>We use the following third-party sub-processors to deliver the Service. Each sub-processor is bound by a Data Processing Agreement (DPA) that requires them to process personal data in accordance with UK GDPR:</p>

            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">Sub-Processor</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">Purpose</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">Data Processed</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">Location</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">Supabase</td>
                    <td className="px-4 py-3">Database hosting, authentication, and data storage</td>
                    <td className="px-4 py-3">Account data, service data, authentication tokens</td>
                    <td className="px-4 py-3">EU/US</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">Stripe</td>
                    <td className="px-4 py-3">Payment processing and subscription management</td>
                    <td className="px-4 py-3">Billing details, payment card tokens, transaction history</td>
                    <td className="px-4 py-3">US/EU</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">Resend</td>
                    <td className="px-4 py-3">Transactional and marketing email delivery</td>
                    <td className="px-4 py-3">Email addresses, names, email content</td>
                    <td className="px-4 py-3">US</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">Vercel</td>
                    <td className="px-4 py-3">Application hosting and content delivery</td>
                    <td className="px-4 py-3">IP addresses, technical data, access logs</td>
                    <td className="px-4 py-3">Global (Edge Network)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4">We will notify you of any changes to our sub-processors by updating this Policy. If you object to a new sub-processor, you may terminate your subscription in accordance with our <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">5. International Data Transfers</h2>
            <p>Some of our sub-processors are located outside the United Kingdom. Where personal data is transferred to countries that have not been deemed to provide an adequate level of data protection by the UK Secretary of State, we ensure appropriate safeguards are in place:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">UK Adequacy Decisions:</strong> Transfers to countries recognised by the UK as providing adequate data protection (including the EU/EEA under the UK adequacy regulations).</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Standard Contractual Clauses (SCCs):</strong> For transfers to the United States and other countries without adequacy decisions, we rely on the International Data Transfer Agreement (IDTA) or the EU SCCs with the UK Addendum, as approved by the Information Commissioner&apos;s Office (ICO).</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Supplementary Measures:</strong> Where necessary, we implement additional technical and organisational safeguards, such as encryption and pseudonymisation, to ensure the transferred data remains protected.</li>
            </ul>
            <p className="mt-2">Specifically:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">Supabase:</strong> Data may be stored in EU or US regions. Transfers to the US are covered by SCCs with the UK Addendum.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Stripe:</strong> Operates globally with data stored in the US and EU. Transfers are governed by SCCs and Stripe&apos;s Binding Corporate Rules.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Vercel:</strong> Uses a global edge network. Transfers outside the UK are covered by SCCs with the UK Addendum.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Resend:</strong> Data is processed in the US. Transfers are covered by SCCs with the UK Addendum.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">6. Data Retention</h2>
            <p>We retain personal data only for as long as necessary to fulfil the purposes for which it was collected. Our retention periods are as follows:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">Account data:</strong> Retained for the duration of your account plus 30 days after account deletion to allow for recovery.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Payment and transaction records:</strong> Retained for 7 years as required by UK tax law (HMRC requirements).</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Service usage data:</strong> Retained for up to 24 months for analytics and service improvement, then anonymised or deleted.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Email communication logs:</strong> Retained for 12 months for delivery tracking and troubleshooting.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Support correspondence:</strong> Retained for 3 years after your last interaction.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Security and access logs:</strong> Retained for 12 months for security monitoring and incident investigation.</li>
            </ul>
            <p className="mt-2">When personal data is no longer required, it is securely deleted or anonymised in accordance with our data disposal procedures.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">7. Security Measures</h2>
            <p>We implement appropriate technical and organisational measures to ensure a level of security appropriate to the risk, including:</p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">7.1 Technical Measures</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">Encryption at Rest:</strong> All personal data stored in our database is encrypted at rest using AES-256 encryption.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Encryption in Transit:</strong> All data transmitted between your browser and our servers is encrypted using TLS 1.2 or higher.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Access Controls:</strong> Role-based access controls (RBAC) limit access to personal data to authorised personnel only.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Row-Level Security:</strong> Database-level security ensures that users can only access their own data.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Secure Authentication:</strong> Passwords are hashed using bcrypt. Multi-factor authentication is available for all accounts.</li>
              <li><strong className="text-gray-800 dark:text-gray-200">PCI DSS Compliance:</strong> Payment processing is handled by Stripe, which is certified PCI DSS Level 1.</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">7.2 Organisational Measures</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Staff with access to personal data receive data protection training</li>
              <li>Access to production systems is restricted and logged</li>
              <li>Regular security reviews and vulnerability assessments are conducted</li>
              <li>Incident response procedures are documented and tested</li>
              <li>Sub-processor security practices are reviewed as part of our due diligence process</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">8. Data Breach Notification</h2>
            <p>In the event of a personal data breach, we will follow the notification requirements set out in Articles 33 and 34 of the UK GDPR:</p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">8.1 Notification to the ICO</h3>
            <p>Where a personal data breach is likely to result in a risk to the rights and freedoms of individuals, we will notify the Information Commissioner&apos;s Office (ICO) within <strong className="text-gray-800 dark:text-gray-200">72 hours</strong> of becoming aware of the breach, in accordance with Article 33 of the UK GDPR. The notification will include:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The nature of the breach, including the categories and approximate number of individuals affected</li>
              <li>The name and contact details of our Data Protection Officer</li>
              <li>A description of the likely consequences of the breach</li>
              <li>A description of the measures taken or proposed to address the breach</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">8.2 Notification to Affected Individuals</h3>
            <p>Where a breach is likely to result in a <strong className="text-gray-800 dark:text-gray-200">high risk</strong> to the rights and freedoms of individuals, we will notify the affected individuals without undue delay, providing clear information about the breach and the steps they can take to protect themselves.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">9. Data Subject Rights</h2>
            <p>We support the exercise of data subject rights as set out in the UK GDPR. Individuals whose personal data we process have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">Access</strong> their personal data (Article 15)</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Rectify</strong> inaccurate or incomplete data (Article 16)</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Erase</strong> their personal data (Article 17)</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Restrict</strong> processing of their data (Article 18)</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Data portability</strong> &mdash; receive their data in a structured, machine-readable format (Article 20)</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Object</strong> to processing based on legitimate interests or for direct marketing (Article 21)</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, please contact us at <a href="mailto:privacy@ai-assist-smes.co.uk" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@ai-assist-smes.co.uk</a>. We will respond within one month of receiving your request.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">10. Changes to This Policy</h2>
            <p>We may update this Data Processing Policy from time to time to reflect changes in our processing activities, sub-processors, or applicable law. Material changes will be communicated by updating this page with a revised &ldquo;Last updated&rdquo; date. Where significant changes are made, we will also notify you by email.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">11. Contact Us</h2>
            <p>For any questions about this Data Processing Policy or our data processing practices:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">Data Protection Officer:</strong> <a href="mailto:privacy@ai-assist-smes.co.uk" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@ai-assist-smes.co.uk</a></li>
              <li><strong className="text-gray-800 dark:text-gray-200">Address:</strong> AI-Assist for SMEs, Birmingham, United Kingdom</li>
            </ul>
            <p className="mt-2">You also have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">ico.org.uk/make-a-complaint</a> or by calling 0303 123 1113.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">&larr; Back to Home</Link>
          <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</Link>
        </div>
      </div>
    </div>
  )
}
