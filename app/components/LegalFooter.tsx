import Link from 'next/link'

/**
 * Standardised legal footer for all public-facing pages.
 * Includes: business identification, legal links (Privacy, Terms, Cookies),
 * company links, and UK business info.
 * Required for UK GDPR / ICO compliance.
 */
export default function LegalFooter() {
  return (
    <footer className="bg-[#080c1a] text-white py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4 gradient-text">AI-Assist for SMEs</h4>
            <p className="text-[#94a3b8] text-sm">Empowering small businesses with AI automation solutions.</p>
            <p className="text-[#64748b] text-xs mt-3">AI-Assist for SMEs<br />Birmingham, United Kingdom</p>
            <p className="text-[#64748b] text-xs mt-1"><a href="tel:+441210000000" className="hover:text-[#94a3b8] transition">+44 121 000 0000</a></p>
            <p className="text-[#64748b] text-xs mt-1">ICO Registered: ZB123456</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#f1f5f9] mb-4">Product</h4>
            <ul className="space-y-2 text-[#94a3b8] text-sm">
              <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/plans" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#f1f5f9] mb-4">Company</h4>
            <ul className="space-y-2 text-[#94a3b8] text-sm">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/support" className="hover:text-white transition">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-[#f1f5f9] mb-4">Legal</h4>
            <ul className="space-y-2 text-[#94a3b8] text-sm">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition">Refund Policy</Link></li>
              <li><Link href="/data-processing" className="hover:text-white transition">Data Processing</Link></li>
              <li><Link href="/status" className="hover:text-white transition">System Status</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[#94a3b8] text-sm">
          <p>&copy; {new Date().getFullYear()} AI-Assist for SMEs. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-[#64748b]">
            <Link href="/privacy" className="hover:text-[#94a3b8] transition">Privacy</Link>
            <Link href="/terms" className="hover:text-[#94a3b8] transition">Terms</Link>
            <Link href="/cookies" className="hover:text-[#94a3b8] transition">Cookies</Link>
            <Link href="/refund-policy" className="hover:text-[#94a3b8] transition">Refunds</Link>
            <Link href="/status" className="hover:text-[#94a3b8] transition">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
