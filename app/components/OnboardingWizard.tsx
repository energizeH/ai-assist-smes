'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface OnboardingWizardProps {
  onComplete: () => void
  userName?: string
}

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to AI-Assist',
    description: 'Let\'s set up your account in under 2 minutes',
    icon: '👋',
  },
  {
    id: 'profile',
    title: 'Your Business',
    description: 'Tell us about your company',
    icon: '🏢',
  },
  {
    id: 'goals',
    title: 'Your Goals',
    description: 'What would you like to achieve?',
    icon: '🎯',
  },
  {
    id: 'ready',
    title: 'You\'re All Set',
    description: 'Start automating your business',
    icon: '🚀',
  },
]

const goalOptions = [
  { id: 'lead_capture', label: 'Capture more leads', icon: '🎯' },
  { id: 'automate_comms', label: 'Automate client communications', icon: '💬' },
  { id: 'schedule_appts', label: 'Manage appointments', icon: '📅' },
  { id: 'grow_revenue', label: 'Grow revenue', icon: '📈' },
  { id: 'save_time', label: 'Save time on admin', icon: '⏰' },
  { id: 'improve_support', label: 'Improve customer support', icon: '🤝' },
]

export default function OnboardingWizard({ onComplete, userName }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState('')
  const [teamSize, setTeamSize] = useState('')
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const supabase = createClientComponentClient()

  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const handleComplete = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Save profile info
      if (company || industry) {
        await supabase.auth.updateUser({
          data: { company, industry, team_size: teamSize, onboarding_complete: true },
        })
        await supabase.from('profiles').upsert({
          id: user.id,
          company,
          email: user.email,
          full_name: userName || user.user_metadata?.full_name || '',
        })
      }

      // Save onboarding data to user_settings
      await supabase.from('user_settings').upsert({
        user_id: user.id,
        api_keys: { onboarding_goals: selectedGoals, onboarding_industry: industry, onboarding_team_size: teamSize },
      }, { onConflict: 'user_id' })

      onComplete()
    } catch (err) {
      console.error('Onboarding error:', err)
      onComplete() // Still complete even if save fails
    } finally {
      setSaving(false)
    }
  }

  const canProceed = () => {
    if (currentStep === 1) return company.trim().length > 0
    if (currentStep === 2) return selectedGoals.length > 0
    return true
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a0f1e] via-[#111827] to-[#1e1b4b] z-50 flex items-center justify-center p-4">
      <div className="glass-card-strong max-w-lg w-full overflow-hidden">
        {/* Progress bar */}
        <div className="h-1.5 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#3b82f6] to-[#a855f7] transition-all duration-500 rounded-full"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < currentStep
                    ? 'bg-emerald-500 text-white'
                    : i === currentStep
                      ? 'bg-[#3b82f6] text-white ring-4 ring-[#3b82f6]/30'
                      : 'bg-white/10 text-[#64748b]'
                }`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 sm:w-16 h-0.5 mx-1 ${i < currentStep ? 'bg-emerald-500' : 'bg-white/10'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">{steps[currentStep].icon}</span>
            <h2 className="text-2xl font-bold text-[#f1f5f9] mb-2">
              {currentStep === 0 && userName ? `Welcome, ${userName.split(' ')[0]}!` : steps[currentStep].title}
            </h2>
            <p className="text-[#94a3b8]">{steps[currentStep].description}</p>
          </div>

          {/* Step-specific content */}
          {currentStep === 0 && (
            <div className="space-y-4 text-center">
              <p className="text-sm text-[#94a3b8]">
                AI-Assist helps you automate client communications, capture leads,
                and manage appointments — so you can focus on growing your business.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { icon: '💬', label: 'AI Chat' },
                  { icon: '📅', label: 'Scheduling' },
                  { icon: '🎯', label: 'Lead Capture' },
                ].map(item => (
                  <div key={item.label} className="bg-[#3b82f6]/10 rounded-xl p-3 text-center border border-[#3b82f6]/20">
                    <span className="text-2xl block mb-1">{item.icon}</span>
                    <span className="text-xs font-medium text-[#60a5fa]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Company Name *</label>
                <input
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Acme Solutions"
                  className="input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Industry</label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Select your industry</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="services">Professional Services</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="hospitality">Hospitality & Food</option>
                  <option value="construction">Construction & Trades</option>
                  <option value="beauty">Beauty & Wellness</option>
                  <option value="education">Education & Training</option>
                  <option value="tech">Technology</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94a3b8] mb-1">Team Size</label>
                <select
                  value={teamSize}
                  onChange={e => setTeamSize(e.target.value)}
                  className="input w-full"
                >
                  <option value="">Select team size</option>
                  <option value="1">Just me</option>
                  <option value="2-5">2-5 people</option>
                  <option value="6-20">6-20 people</option>
                  <option value="21-50">21-50 people</option>
                  <option value="50+">50+ people</option>
                </select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    selectedGoals.includes(goal.id)
                      ? 'border-[#3b82f6] bg-[#3b82f6]/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="text-lg block mb-1">{goal.icon}</span>
                  <span className={`text-sm font-medium ${
                    selectedGoals.includes(goal.id)
                      ? 'text-[#60a5fa]'
                      : 'text-[#f1f5f9]'
                  }`}>{goal.label}</span>
                </button>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-4">
              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                <p className="text-emerald-400 font-medium">Your account is ready to go!</p>
              </div>
              <p className="text-sm text-[#94a3b8]">
                Here&apos;s what you can do next:
              </p>
              <div className="text-left space-y-2">
                {[
                  'Add your first client',
                  'Set up an automation',
                  'Schedule an appointment',
                  'Choose a subscription plan',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#f1f5f9]">
                    <span className="w-5 h-5 bg-[#3b82f6]/15 text-[#60a5fa] rounded-full flex items-center justify-center text-xs flex-shrink-0">{i + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="flex-1 py-2.5 rounded-lg font-medium bg-white/5 text-[#f1f5f9] hover:bg-white/10 transition-colors"
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="flex-1 py-2.5 rounded-lg font-medium btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={saving}
                className="flex-1 py-2.5 rounded-lg font-medium bg-gradient-to-r from-[#3b82f6] to-[#7c3aed] text-white hover:from-[#2563eb] hover:to-[#6d28d9] transition-colors disabled:opacity-50"
              >
                {saving ? 'Setting up...' : 'Go to Dashboard'}
              </button>
            )}
          </div>

          {/* Skip option */}
          {currentStep < steps.length - 1 && (
            <button
              onClick={onComplete}
              className="mt-3 w-full text-center text-xs text-[#64748b] hover:text-[#94a3b8] transition-colors"
            >
              Skip setup for now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
