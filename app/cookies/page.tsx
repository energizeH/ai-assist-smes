import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Details about the cookies used on AI-Assist for SMEs, how to manage your preferences, and your rights under UK regulations.',
}


export default function CookiePolicyPage() {
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
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Cookie Policy</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Last updated: 10 March 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">1. What Are Cookies</h2>
            <p>Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and to provide information to website owners. This Cookie Policy explains how AI-Assist for SMEs (&ldquo;we&rdquo;, &ldquo;us&rdquo;) uses cookies and similar technologies on our platform.</p>
            <p>This policy should be read alongside our <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>, which provides further details on how we handle your personal data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">Essential functionality:</strong> To enable core features like authentication, security, and session management</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Preferences:</strong> To remember your settings and preferences (e.g. dark mode, cookie consent)</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Analytics:</strong> To understand how visitors interact with our platform so we can improve it (only with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">3. Types of Cookies We Use</h2>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">3.1 Strictly Necessary Cookies</h3>
            <p className="mb-3">These cookies are essential for the Service to function. They cannot be switched off. They are usually set in response to actions you take, such as logging in or filling in forms.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Cookie Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Purpose</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Duration</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">sb-*-auth-token</td>
                    <td className="px-4 py-3">Supabase authentication session token. Required for login functionality.</td>
                    <td className="px-4 py-3">Session / 1 year</td>
                    <td className="px-4 py-3">Supabase</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">sb-*-auth-token-code-verifier</td>
                    <td className="px-4 py-3">PKCE code verifier for secure OAuth authentication flows.</td>
                    <td className="px-4 py-3">Session</td>
                    <td className="px-4 py-3">Supabase</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">__stripe_mid</td>
                    <td className="px-4 py-3">Stripe fraud prevention. Used to detect and prevent fraudulent payment transactions.</td>
                    <td className="px-4 py-3">1 year</td>
                    <td className="px-4 py-3">Stripe</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">__stripe_sid</td>
                    <td className="px-4 py-3">Stripe session identifier for payment processing.</td>
                    <td className="px-4 py-3">30 minutes</td>
                    <td className="px-4 py-3">Stripe</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">3.2 Functional Cookies</h3>
            <p className="mb-3">These cookies enable helpful features and personalisation. They may be set by us or by third-party providers.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Cookie Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Purpose</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Duration</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">cookie-consent</td>
                    <td className="px-4 py-3">Stores your cookie consent preferences (accepted/essential-only).</td>
                    <td className="px-4 py-3">1 year</td>
                    <td className="px-4 py-3">AI-Assist</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">theme</td>
                    <td className="px-4 py-3">Stores your dark/light mode preference.</td>
                    <td className="px-4 py-3">1 year</td>
                    <td className="px-4 py-3">AI-Assist</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-3">3.3 Analytics Cookies (Require Consent)</h3>
            <p className="mb-3">These cookies help us understand how visitors use our platform. They are only set if you click &ldquo;Accept All&rdquo; on our cookie banner. All data collected is anonymised.</p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Cookie Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Purpose</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Duration</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">_va_id</td>
                    <td className="px-4 py-3">Vercel Analytics visitor identifier. Helps us understand page views and usage patterns.</td>
                    <td className="px-4 py-3">1 year</td>
                    <td className="px-4 py-3">Vercel</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-xs">_va_ses</td>
                    <td className="px-4 py-3">Vercel Analytics session tracking.</td>
                    <td className="px-4 py-3">30 minutes</td>
                    <td className="px-4 py-3">Vercel</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">4. Managing Your Cookie Preferences</h2>
            <p>When you first visit our platform, you will see a cookie consent banner giving you the choice to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">Accept All:</strong> Enables all cookies, including analytics</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Essential Only:</strong> Only strictly necessary and functional cookies are enabled; analytics cookies are blocked</li>
            </ul>
            <p className="mt-2">You can change your cookie preferences at any time by clearing your browser&apos;s cookies and revisiting our site, which will trigger the consent banner again.</p>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">Browser Controls</h3>
            <p>Most web browsers allow you to control cookies through their settings. You can typically:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>See what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
            <p className="mt-2">Please note that blocking essential cookies may prevent parts of the Service from working correctly.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">5. Third-Party Cookies</h2>
            <p>Some cookies on our platform are set by third-party services we use. We do not control these cookies. The third-party services include:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">Supabase:</strong> Authentication and session management</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Stripe:</strong> Secure payment processing and fraud prevention</li>
              <li><strong className="text-gray-800 dark:text-gray-200">Vercel:</strong> Hosting and analytics (only with your consent)</li>
            </ul>
            <p className="mt-2">Please refer to each provider&apos;s cookie policy for more information about how they use cookies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">6. Local Storage</h2>
            <p>In addition to cookies, we use browser local storage for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Storing your cookie consent choice</li>
              <li>Caching your theme preference (dark/light mode)</li>
              <li>Session tokens for authentication</li>
            </ul>
            <p className="mt-2">Local storage data remains on your device until you clear your browser data.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">7. Updates to This Policy</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in our practices or applicable regulations. The &ldquo;Last updated&rdquo; date at the top of this page indicates when this policy was last revised.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">8. Contact Us</h2>
            <p>If you have questions about our use of cookies, please contact us:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-800 dark:text-gray-200">Email:</strong> <a href="mailto:privacy@ai-assist-smes.co.uk" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@ai-assist-smes.co.uk</a></li>
              <li><strong className="text-gray-800 dark:text-gray-200">Address:</strong> AI-Assist for SMEs, Birmingham, United Kingdom</li>
            </ul>
            <p className="mt-2">For more information about your rights under UK GDPR and how we protect your data, please read our <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>.</p>
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
