import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '@/api/admin'
import type { AdminDashboardStats } from '@/types'
import { Users, MessageSquare, Clock, CheckCircle, BookOpen, Bell, Plus, Loader2 } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>

  const cards = [
    { label: 'Total Students', value: stats?.total_students || 0, icon: Users, color: 'text-info bg-info/10', link: '/admin/students' },
    { label: 'Total Enquiries', value: stats?.total_enquiries || 0, icon: MessageSquare, color: 'text-gold bg-gold/10', link: '/admin/enquiries' },
    { label: 'Pending', value: stats?.pending_enquiries || 0, icon: Clock, color: 'text-warning bg-warning/10', link: '/admin/enquiries' },
    { label: 'Resolved', value: stats?.resolved_enquiries || 0, icon: CheckCircle, color: 'text-success bg-success/10', link: '/admin/enquiries' },
  ]

  const actions = [
    { label: 'Manage Students', icon: Users, to: '/admin/students' },
    { label: 'Manage Lessons', icon: BookOpen, to: '/admin/lessons' },
    { label: 'View Enquiries', icon: MessageSquare, to: '/admin/enquiries' },
    { label: 'Send Announcement', icon: Bell, to: '/admin/announcements' },
    { label: 'Invite Student', icon: Plus, to: '/admin/students/create' },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)] mb-6">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} to={card.link}
            className="bg-bg-card border border-border rounded-xl p-4 hover:border-border-light transition-colors no-underline">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-ivory">{card.value}</p>
            <p className="text-xs text-muted mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="label-mono mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action) => (
          <Link key={action.label} to={action.to}
            className="flex items-center gap-3 bg-bg-card border border-border rounded-xl p-4 hover:border-gold/30 hover:bg-bg-elevated transition-colors no-underline group">
            <div className="w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center text-muted group-hover:text-gold transition-colors">
              <action.icon className="w-4 h-4" />
            </div>
            <span className="text-sm text-ivory group-hover:text-gold transition-colors">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
