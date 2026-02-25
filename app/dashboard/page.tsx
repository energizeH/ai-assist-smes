'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">AI-Assist Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <span className="text-sm">Support</span>
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <span className="text-sm">Account</span>
              </button>
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-700">
                Logout
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'clients', label: 'Clients' },
              { id: 'appointments', label: 'Appointments' },
              { id: 'leads', label: 'Leads' },
              { id: 'automations', label: 'Automations' },
              { id: 'settings', label: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600">Total Clients</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">247</div>
                <div className="mt-2 text-sm text-green-600">+12% from last month</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600">Active Leads</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">89</div>
                <div className="mt-2 text-sm text-green-600">+23% from last month</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600">Appointments Today</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">15</div>
                <div className="mt-2 text-sm text-gray-600">3 pending confirmation</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600">Automation Uptime</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">99.8%</div>
                <div className="mt-2 text-sm text-green-600">All systems operational</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { time: '10 minutes ago', action: 'New lead captured', detail: 'John Smith via website form' },
                    { time: '25 minutes ago', action: 'Appointment booked', detail: 'Sarah Johnson - Tomorrow 2:00 PM' },
                    { time: '1 hour ago', action: 'WhatsApp message sent', detail: 'Appointment reminder to 5 clients' },
                    { time: '2 hours ago', action: 'Lead qualified', detail: 'Michael Brown moved to sales pipeline' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                        <div className="text-sm text-gray-600">{activity.detail}</div>
                      </div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Client Management</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Add Client
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Client list and management interface will be displayed here.</p>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Appointment Calendar</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Calendar view and appointment scheduling interface will be displayed here.</p>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Lead Pipeline</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Lead tracking and conversion funnel will be displayed here.</p>
            </div>
          </div>
        )}

        {/* Automations Tab */}
        {activeTab === 'automations' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Active Automations</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { name: 'AI Receptionist', status: 'Active', calls: '152 today' },
                { name: 'WhatsApp Automation', status: 'Active', messages: '89 sent today' },
                { name: 'Email Follow-up', status: 'Active', emails: '45 sent today' },
                { name: 'Appointment Reminders', status: 'Active', reminders: '12 scheduled' },
              ].map((automation, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{automation.name}</div>
                    <div className="text-sm text-gray-600">
                      {automation.calls || automation.messages || automation.emails || automation.reminders}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {automation.status}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">Configure</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">Account configuration and preferences will be displayed here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
