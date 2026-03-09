import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">AI-Assist for SMEs</Link>
            <div className="flex space-x-4">
              <Link href="/login" className="btn btn-secondary">Login</Link>
              <Link href="/register" className="btn btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-custom py-16 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: March 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 dark:text-gray-400">By accessing and using AI-Assist for SMEs, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">2. Use of Service</h2>
            <p className="text-gray-600 dark:text-gray-400">You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use the service in any way that violates any applicable national or international law or regulation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">3. Subscription and Payment</h2>
            <p className="text-gray-600 dark:text-gray-400">Some parts of our service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis. Billing cycles are set on a monthly or annual basis depending on the subscription plan you select.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">4. Cancellation</h2>
            <p className="text-gray-600 dark:text-gray-400">You can cancel your subscription at any time. Upon cancellation, your subscription will remain active until the end of the current billing period, after which it will not renew.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">5. Intellectual Property</h2>
            <p className="text-gray-600 dark:text-gray-400">The service and its original content, features, and functionality are and will remain the exclusive property of AI-Assist for SMEs. Our service is protected by copyright, trademark, and other laws.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">6. Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-gray-400">In no event shall AI-Assist for SMEs, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">7. Governing Law</h2>
            <p className="text-gray-600 dark:text-gray-400">These Terms shall be governed and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">8. Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-400">If you have any questions about these Terms, please contact us at <a href="mailto:legal@ai-assist-smes.co.uk" className="text-primary-600 hover:underline">legal@ai-assist-smes.co.uk</a>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link href="/" className="text-primary-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
