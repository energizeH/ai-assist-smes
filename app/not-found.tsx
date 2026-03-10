import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist or has been moved.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Nav */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              AI-Assist for SMEs
            </Link>
            <div className="flex space-x-4">
              <Link href="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium transition">Login</Link>
              <Link href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 404 Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-8xl font-bold text-gray-200 dark:text-gray-800 mb-4">404</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Page not found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-gray-400 dark:text-gray-500">
            <Link href="/services" className="hover:text-blue-600 transition">Services</Link>
            <Link href="/plans" className="hover:text-blue-600 transition">Pricing</Link>
            <Link href="/about" className="hover:text-blue-600 transition">About</Link>
            <Link href="/support" className="hover:text-blue-600 transition">Support</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
