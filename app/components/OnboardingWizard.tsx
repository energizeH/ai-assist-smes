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
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 dark:bg-gray-700">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 rounded-full"
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
                    ? 'bg-green-500 text-white'
                    : i === currentStep
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 sm:w-16 h-0.5 mx-1 ${i < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">{steps[currentStep].icon}</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {currentStep === 0 && userName ? `Welcome, ${userName.split(' ')[0]}!` : steps[currentStep].title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{steps[currentStep].description}</p>
          </div>

          {/* Step-specific content */}
          {currentStep === 0 && (
            <div className="space-y-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                AI-Assist helps you automate client communications, capture leads, 
                and manage appointments — so you can focus on growing your business.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { icon: '💬', label: 'AI Chat' },
                  { icon: '📅', label: 'Scheduling' },
                  { icon: '🎯', label: 'Lead Capture' },
                ].map(item => (
                  <div key={item.label} className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
                    <span className="text-2xl block mb-1">{item.icon}</span>
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
                <input
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Acme Solutions"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                <select
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Size</label>
                <select
                  value={teamSize}
                  onChange={e => setTeamSize(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span className="text-lg block mb-1">{goal.icon}</span>
                  <span className={`text-sm font-medium ${
                    selectedGoals.includes(goal.id)
                      ? 'text-blue-700 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>{goal.label}</span>
                </button>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <p className="text-green-700 dark:text-green-400 font-medium">Your account is ready to go!</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Here&apos;s what you can do next:
              </p>
              <div className="text-left space-y-2">
                {[
                  'Add your first client',
                  'Set up an automation',
                  'Schedule an appointment',
                  'Choose a subscription plan',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs flex-shrink-0">{i + 1}</span>
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
                className="flex-1 py-2.5 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="flex-1 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={saving}
                className="flex-1 py-2.5 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Setting up...' : 'Go to Dashboard'}
              </button>
            )}
          </div>

          {/* Skip option */}
          {currentStep < steps.length - 1 && (
            <button
              onClick={onComplete}
              className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Skip setup for now
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
