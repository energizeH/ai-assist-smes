import Link from 'next/link'

/**
 * Standardised legal footer for all public-facing pages.
 * Includes: business identification, legal links (Privacy, Terms, Cookies),
 * company links, and UK business info.
 * Required for UK GDPR / ICO compliance.
 */
export default function LegalFooter() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">AI-Assist for SMEs</h4>
            <p className="text-gray-400 text-sm">Empowering small businesses with AI automation solutions.</p>
            <p className="text-gray-500 text-xs mt-3">AI-Assist for SMEs<br />Birmingham, United Kingdom</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/plans" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/support" className="hover:text-white transition">Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} AI-Assist for SMEs. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition">Terms</Link>
            <Link href="/cookies" className="hover:text-gray-300 transition">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
