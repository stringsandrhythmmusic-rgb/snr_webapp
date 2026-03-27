import { useState, useEffect } from 'react'
import { getNotifications, markAsRead, markAllAsRead } from '@/api/notifications'
import { formatRelativeTime } from '@/lib/utils'
import type { Notification } from '@/types'
import { Bell, Heart, MessageCircle, Mail, Megaphone, CheckCheck, Loader2 } from 'lucide-react'

const icons: Record<string, typeof Bell> = {
  announcement: Megaphone,
  like: Heart,
  comment: MessageCircle,
  message: Mail,
  system: Bell,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotifications()
      .then((data) => { setNotifications(data.notifications); setUnreadCount(data.unread_count) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleMarkRead = async (n: Notification) => {
    if (n.is_read) return
    try {
      await markAsRead(n.id)
      setNotifications((prev) => prev.map((item) => item.id === n.id ? { ...item, is_read: true } : item))
      setUnreadCount((c) => Math.max(0, c - 1))
    } catch { /* ignore */ }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch { /* ignore */ }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)]">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-gold text-bg text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-sm text-gold hover:text-gold-light transition-colors">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <Bell className="w-12 h-12 mx-auto mb-4 text-subtle" />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map((n) => {
            const Icon = icons[n.notification_type] || Bell
            return (
              <button
                key={n.id}
                onClick={() => handleMarkRead(n)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl text-left transition-colors ${
                  n.is_read ? 'hover:bg-bg-card' : 'bg-bg-card hover:bg-bg-elevated'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  n.is_read ? 'bg-bg-elevated text-subtle' : 'bg-gold/10 text-gold'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${n.is_read ? 'text-muted' : 'text-ivory'}`}>{n.title}</span>
                    {!n.is_read && <div className="w-2 h-2 bg-gold rounded-full shrink-0" />}
                  </div>
                  <p className="text-xs text-muted mt-0.5 truncate">{n.message}</p>
                  <span className="text-[11px] text-subtle">{formatRelativeTime(n.created_at)}</span>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
