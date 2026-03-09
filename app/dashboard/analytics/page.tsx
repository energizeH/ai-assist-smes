'use client'

import { useState, useEffect } from 'react'
import { BarChart, TrendingUp, Users, Activity, Phone, MessageSquare, Mail, Calendar } from 'lucide-react'

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { label: 'Total AI Calls', value: '1,284', change: '+12%', icon: Phone, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'WhatsApp Messages', value: '5,420', change: '+18%', icon: MessageSquare, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Email Follow-ups', value: '842', change: '+5%', icon: Mail, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Booked Appointments', value: '156', change: '+24%', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-100' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time performance metrics for your AI assistants.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Year to Date</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-green-500 text-xs font-medium flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Activity Volume</h3>
          <div className="h-64 flex items-end gap-2 px-2">
            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-t transition-all cursor-pointer group relative" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h * 10}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 px-2 font-medium">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Channel Distribution</h3>
          <div className="space-y-6">
            {[
              { label: 'Voice AI', value: '42%', color: 'bg-blue-500', width: '42%' },
              { label: 'WhatsApp', value: '35%', color: 'bg-green-500', width: '35%' },
              { label: 'Email', value: '15%', color: 'bg-purple-500', width: '15%' },
              { label: 'Web Chat', value: '8%', color: 'bg-orange-500', width: '8%' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                  <span className="text-gray-500 dark:text-gray-400">{item.value}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: item.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
