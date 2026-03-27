import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@/components/Avatar'
import { getConversations } from '@/api/chat'
import { formatRelativeTime, truncate } from '@/lib/utils'
import type { Conversation } from '@/types'
import { MessageCircle, Loader2 } from 'lucide-react'

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getConversations()
      .then((data) => setConversations(data.conversations || data as unknown as Conversation[]))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)] mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-subtle" />
          <p>No conversations yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {conversations.map((conv) => (
            <Link
              key={conv.user.id}
              to={`/chat/${conv.user.id}`}
              state={{ userName: conv.user.full_name }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg-card transition-colors no-underline"
            >
              <Avatar name={conv.user.full_name} url={conv.user.avatar_url} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ivory">{conv.user.full_name}</span>
                  {conv.last_message && (
                    <span className="text-[11px] text-subtle">{formatRelativeTime(conv.last_message.created_at)}</span>
                  )}
                </div>
                {conv.last_message && (
                  <p className="text-xs text-muted truncate mt-0.5">{truncate(conv.last_message.message, 50)}</p>
                )}
              </div>
              {conv.unread_count > 0 && (
                <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-bold text-bg">{conv.unread_count}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
