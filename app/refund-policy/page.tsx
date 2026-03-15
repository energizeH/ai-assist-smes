import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy | AI-Assist for SMEs',
  description: 'UK-compliant refund policy for AI-Assist for SMEs SaaS subscription service, including 14-day cooling-off period and cancellation terms.',
}


export default function RefundPolicyPage() {
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
        <h1 className="text-4xl font-bold text-[#f1f5f9] mb-4">Refund Policy</h1>
        <p className="text-[#64748b] mb-8">Last updated: March 2026</p>

        <div className="glass-card-static p-8 sm:p-10 space-y-8 text-[#94a3b8]">
          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">1. Overview</h2>
            <p>AI-Assist for SMEs (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to fair and transparent refund practices. This Refund Policy applies to all subscription plans purchased through our platform and is compliant with the Consumer Rights Act 2015 and the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013.</p>
            <p className="mt-2">By subscribing to our Service, you agree to the terms of this Refund Policy. Please read it carefully before making a purchase.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">2. 14-Day Cooling-Off Period</h2>
            <p>Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, you have the right to cancel your subscription within 14 days of purchase without giving any reason. This cooling-off period applies to all new subscriptions, including both monthly and annual plans.</p>
            <h3 className="text-lg font-semibold text-[#f1f5f9] mt-4 mb-2">2.1 Monthly Plans</h3>
            <p>If you cancel a monthly subscription within the 14-day cooling-off period, you will receive a full refund of the subscription fee paid. If you have used the Service during this period and expressly requested that the Service begin before the end of the cooling-off period, we may deduct a proportionate amount for the service already provided.</p>
            <h3 className="text-lg font-semibold text-[#f1f5f9] mt-4 mb-2">2.2 Annual Plans</h3>
            <p>If you cancel an annual subscription within the 14-day cooling-off period, you will receive a pro-rata refund. This means we will calculate the cost of any days you have used the Service and refund the remaining balance of your annual payment.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">3. Cancellations After the Cooling-Off Period</h2>
            <h3 className="text-lg font-semibold text-[#f1f5f9] mt-4 mb-2">3.1 Monthly Plans</h3>
            <p>If you cancel a monthly subscription after the 14-day cooling-off period has expired, no refund will be issued for the current billing period. However, your access to the Service will continue until the end of your current paid period. Your subscription will not renew, and no further charges will be made.</p>
            <h3 className="text-lg font-semibold text-[#f1f5f9] mt-4 mb-2">3.2 Annual Plans</h3>
            <p>If you cancel an annual subscription after the 14-day cooling-off period, no refund will be issued for the remaining months of the annual term. Your access to the Service will continue until the end of your current annual billing period. Your subscription will not renew at the end of the term.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">4. How to Request a Refund</h2>
            <p>To request a refund within the 14-day cooling-off period, please contact our support team using one of the following methods:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-[#f1f5f9]">Email:</strong> Send your refund request to <a href="mailto:support@aiassistsmes.co.uk" className="text-[#60a5fa] hover:text-[#3b82f6] transition">support@aiassistsmes.co.uk</a></li>
              <li><strong className="text-[#f1f5f9]">Subject Line:</strong> Please include &ldquo;Refund Request&rdquo; in the subject line of your email</li>
            </ul>
            <p className="mt-2">When submitting your refund request, please include:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your full name and the email address associated with your account</li>
              <li>The date of your subscription purchase</li>
              <li>Your subscription plan type (monthly or annual)</li>
              <li>The reason for your refund request (optional, but appreciated)</li>
            </ul>
            <p className="mt-2">We aim to acknowledge all refund requests within 2 business days and process approved refunds within 5&ndash;10 business days. Refunds will be issued to the original payment method used at the time of purchase.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">5. Exceptional Circumstances</h2>
            <p>We may, at our sole discretion, offer refunds or credits outside of the standard policy in exceptional circumstances, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-[#f1f5f9]">Service Unavailability:</strong> If the Service experiences prolonged downtime or is materially unavailable for a significant portion of your billing period due to issues within our control.</li>
              <li><strong className="text-[#f1f5f9]">Duplicate Charges:</strong> If you have been charged more than once for the same subscription period in error.</li>
              <li><strong className="text-[#f1f5f9]">Unauthorised Transactions:</strong> If a payment was made without your authorisation (subject to verification).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">6. Free Trials</h2>
            <p>If you signed up for a free trial and did not cancel before the trial period ended, your subscription will automatically convert to a paid plan. The 14-day cooling-off period under the Consumer Contracts Regulations 2013 applies from the date of your first paid charge, not from the start of the free trial.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">7. Your Statutory Rights</h2>
            <p>Nothing in this Refund Policy affects your statutory rights under UK consumer law, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-[#f1f5f9]">Consumer Rights Act 2015:</strong> You are entitled to a service that is performed with reasonable care and skill, is fit for purpose, and matches any description provided. If the Service fails to meet these standards, you may be entitled to a repeat performance, a price reduction, or a refund.</li>
              <li><strong className="text-[#f1f5f9]">Consumer Contracts Regulations 2013:</strong> You have the right to cancel distance contracts within 14 days as described in Section 2 above.</li>
            </ul>
            <p className="mt-2">For more information about your consumer rights, visit <a href="https://www.citizensadvice.org.uk/consumer/" target="_blank" rel="noopener noreferrer" className="text-[#60a5fa] hover:text-[#3b82f6] transition">Citizens Advice</a> or contact your local Trading Standards office.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">8. Changes to This Policy</h2>
            <p>We may update this Refund Policy from time to time. Any changes will be posted on this page with a revised &ldquo;Last updated&rdquo; date. Changes will not apply retrospectively to any purchases made before the date of the update. We encourage you to review this policy periodically.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#f1f5f9] mb-3">9. Contact Us</h2>
            <p>If you have any questions about this Refund Policy or wish to discuss a refund request:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-[#f1f5f9]">Email:</strong> <a href="mailto:support@aiassistsmes.co.uk" className="text-[#60a5fa] hover:text-[#3b82f6] transition">support@aiassistsmes.co.uk</a></li>
              <li><strong className="text-[#f1f5f9]">Address:</strong> AI-Assist for SMEs, Birmingham, United Kingdom</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4">
          <Link href="/" className="text-[#60a5fa] hover:text-[#3b82f6] transition">&larr; Back to Home</Link>
          <Link href="/terms" className="text-[#60a5fa] hover:text-[#3b82f6] transition">Terms of Service</Link>
          <Link href="/privacy" className="text-[#60a5fa] hover:text-[#3b82f6] transition">Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}
