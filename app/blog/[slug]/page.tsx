import Link from 'next/link'
import { notFound } from 'next/navigation'
import LegalFooter from '../../components/LegalFooter'
import { posts } from '../posts'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = posts.find(p => p.slug === slug)

  if (!post) notFound()

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">AI-Assist for SMEs</Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">Home</Link>
              <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 transition">About</Link>
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

      {/* Article */}
      <article className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom max-w-3xl mx-auto">
          <Link href="/blog" className="text-primary-600 hover:underline text-sm mb-6 inline-block">← Back to Blog</Link>
          <div className="text-6xl mb-6">{post.emoji}</div>
          <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">{post.category}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <span>By {post.author}</span>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-600 dark:prose-p:text-gray-300
              prose-li:text-gray-600 dark:prose-li:text-gray-300
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-a:text-primary-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ready to automate your business?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Book a free 30-minute consultation and discover how AI can help your SME save time and grow.</p>
            <Link href="/contact" className="btn btn-primary px-8 py-3">Get Free Consultation</Link>
          </div>
        </div>
      </article>

      <LegalFooter />
    </div>
  )
}
