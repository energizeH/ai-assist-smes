import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions governing your use of the AI-Assist for SMEs platform, including subscriptions, payments, and liability.',
}


export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: 10 March 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">1. Introduction and Acceptance</h2>
            <p>These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the AI-Assist for SMEs platform (&ldquo;Service&rdquo;), operated by AI-Assist for SMEs (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), a company registered in England and Wales, based in Birmingham, United Kingdom.</p>
            <p>By creating an account or using our Service, you (&ldquo;you&rdquo;, &ldquo;the Customer&rdquo;) agree to be bound by these Terms. If you are accepting these Terms on behalf of a business or other legal entity, you represent that you have the authority to bind that entity. If you do not agree to these Terms, do not use our Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">2. Service Description</h2>
            <p>AI-Assist for SMEs is a Software-as-a-Service (SaaS) platform that provides AI-powered business automation tools for small and medium enterprises, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>AI chatbot and customer engagement tools</li>
              <li>Workflow automation and process optimisation</li>
              <li>Business analytics and reporting</li>
              <li>CRM and lead management</li>
              <li>Email and marketing automation</li>
              <li>Appointment scheduling and management</li>
              <li>Third-party integrations (WhatsApp, Twilio, SendGrid, Zapier, Google Calendar)</li>
            </ul>
            <p className="mt-2">The specific features available to you depend on your subscription plan.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">3. Account Registration</h2>
            <p>To use the Service, you must register for an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorised use of your account</li>
            </ul>
            <p className="mt-2">You must be at least 18 years old to create an account. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">4. Subscription Plans and Pricing</h2>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">4.1 Plans</h3>
            <p>We offer the following subscription plans, billed monthly in British Pounds (GBP):</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">Starter:</strong> &pound;49/month</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Professional:</strong> &pound;149/month</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Enterprise:</strong> &pound;299/month</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">4.2 Billing</h3>
            <p>Subscription fees are billed in advance on a recurring monthly basis. Payment is processed securely through Stripe. By subscribing, you authorise us to charge your payment method on each billing cycle.</p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">4.3 Price Changes</h3>
            <p>We reserve the right to modify our prices. Any price changes will be communicated to you at least 30 days before taking effect. Continued use of the Service after a price change constitutes acceptance of the new pricing.</p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">4.4 Taxes</h3>
            <p>All prices are exclusive of applicable taxes (including VAT). You are responsible for any taxes applicable to your subscription, except for taxes on our income.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">5. Free Trials and Promotions</h2>
            <p>We may offer free trials or promotional pricing at our discretion. At the end of a free trial period, your account will be downgraded to the free tier unless you subscribe to a paid plan. We reserve the right to limit free trial availability to one per person or organisation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">6. Cancellation and Refunds</h2>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">6.1 Cancellation by You</h3>
            <p>You may cancel your subscription at any time through your account dashboard or by contacting us. Upon cancellation:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your subscription remains active until the end of the current billing period</li>
              <li>You will not be charged for subsequent billing periods</li>
              <li>Your data will be retained for 30 days after cancellation, after which it may be deleted</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">6.2 Refunds</h3>
            <p>Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, you have a 14-day cooling-off period from the date of your first subscription purchase. To request a refund within this period, contact us at <a href="mailto:support@aiassistsmes.co.uk" className="text-blue-600 dark:text-blue-400 hover:underline">support@aiassistsmes.co.uk</a>. After the 14-day period, subscription fees are non-refundable.</p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">6.3 Cancellation by Us</h3>
            <p>We may suspend or terminate your account if you breach these Terms, fail to pay subscription fees, or engage in activities harmful to the Service or other users. In the event of termination for cause, no refund will be provided.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">7. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Violate any applicable law or regulation</li>
              <li>Infringe the intellectual property rights of others</li>
              <li>Transmit harmful, offensive, or unlawful content</li>
              <li>Attempt to gain unauthorised access to the Service or its systems</li>
              <li>Send unsolicited commercial communications (spam)</li>
              <li>Interfere with or disrupt the Service or its infrastructure</li>
              <li>Use the AI tools to generate misleading, fraudulent, or harmful content</li>
              <li>Reverse engineer, decompile, or disassemble the Service</li>
              <li>Resell or redistribute the Service without our written consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">8. Intellectual Property</h2>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">8.1 Our IP</h3>
            <p>The Service, including its software, design, features, documentation, and branding, is owned by AI-Assist for SMEs and protected by copyright, trademark, and other intellectual property laws of England and Wales and international treaties.</p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">8.2 Your Content</h3>
            <p>You retain ownership of all data, content, and materials you upload to or create using the Service (&ldquo;Your Content&rdquo;). You grant us a limited, non-exclusive licence to host, process, and display Your Content solely for the purpose of providing the Service.</p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">8.3 AI-Generated Content</h3>
            <p>Content generated by our AI tools based on your inputs is owned by you, subject to any limitations of the underlying AI model providers. We make no claim of ownership over AI-generated outputs.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">9. Data Protection</h2>
            <p>We process your personal data in accordance with our <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link> and in compliance with UK GDPR and the Data Protection Act 2018. Where you use the Service to process personal data of your own customers or contacts, you act as the data controller and we act as the data processor. You are responsible for ensuring your use of our Service complies with applicable data protection laws.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">10. Service Availability and SLA</h2>
            <p>We aim to provide 99.9% uptime but do not guarantee uninterrupted service. We may perform scheduled maintenance with reasonable advance notice. We are not liable for service interruptions caused by factors beyond our reasonable control, including internet outages, third-party service failures, or force majeure events.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">11. Limitation of Liability</h2>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">11.1 Exclusions</h3>
            <p>To the maximum extent permitted by law, we shall not be liable for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, goodwill, or business opportunity</li>
              <li>Damages resulting from your use of or inability to use the Service</li>
              <li>Damages resulting from AI-generated content or recommendations</li>
            </ul>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">11.2 Cap</h3>
            <p>Our total liability to you for any claims arising from or related to these Terms or the Service shall not exceed the total amount you have paid us in the 12 months preceding the claim.</p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">11.3 Consumer Rights</h3>
            <p>Nothing in these Terms excludes or limits our liability for: (a) death or personal injury caused by our negligence; (b) fraud or fraudulent misrepresentation; or (c) any matter for which it would be unlawful to exclude or limit liability under the Consumer Rights Act 2015.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">12. Indemnification</h2>
            <p>You agree to indemnify and hold harmless AI-Assist for SMEs, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable legal fees) arising from your use of the Service, your violation of these Terms, or your infringement of any third-party rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">13. Dispute Resolution</h2>
            <p>If a dispute arises under these Terms, we encourage you to contact us first at <a href="mailto:support@aiassistsmes.co.uk" className="text-blue-600 dark:text-blue-400 hover:underline">support@aiassistsmes.co.uk</a> to resolve the matter informally. If the dispute cannot be resolved informally within 30 days, either party may pursue resolution through the courts of England and Wales.</p>
            <p className="mt-2">If you are a consumer, you may also be entitled to use the UK&apos;s alternative dispute resolution (ADR) procedures.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">14. Changes to These Terms</h2>
            <p>We may modify these Terms at any time. Material changes will be communicated to you at least 30 days before they take effect, either by email or through a notice on the Service. Your continued use of the Service after the changes take effect constitutes acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">15. Governing Law</h2>
            <p>These Terms are governed by and construed in accordance with the laws of England and Wales. The courts of England and Wales shall have exclusive jurisdiction over any disputes arising from or in connection with these Terms, subject to any mandatory consumer protection laws that may apply in your jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">16. Severability</h2>
            <p>If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">17. Contact Us</h2>
            <p>For any questions about these Terms of Service:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">Email:</strong> <a href="mailto:legal@aiassistsmes.co.uk" className="text-blue-600 dark:text-blue-400 hover:underline">legal@aiassistsmes.co.uk</a></li>
              <li><strong className="text-gray-800 dark:text-gray-200">Support:</strong> <a href="mailto:support@aiassistsmes.co.uk" className="text-blue-600 dark:text-blue-400 hover:underline">support@aiassistsmes.co.uk</a></li>
              <li><strong className="text-gray-800 dark:text-gray-200">Address:</strong> AI-Assist for SMEs, Birmingham, United Kingdom</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">&larr; Back to Home</Link>
          <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>
          <Link href="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline">Cookie Policy</Link>
        </div>
      </div>
    </div>
  )
}
