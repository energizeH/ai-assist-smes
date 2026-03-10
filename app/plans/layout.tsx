import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing Plans',
  description: 'Choose the right AI automation plan for your business. Starter £49/month, Professional £149/month, Enterprise £299/month. All plans include a free consultation.',
}

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return children
}
