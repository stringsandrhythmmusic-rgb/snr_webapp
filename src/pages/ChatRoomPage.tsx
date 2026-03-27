import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useWebSocket } from '@/hooks/useWebSocket'
import Avatar from '@/components/Avatar'
import { getChatHistory, sendMessage as sendMessageApi, markMessagesAsRead } from '@/api/chat'
import { formatRelativeTime } from '@/lib/utils'
import type { ChatMessage } from '@/types'
import { ArrowLeft, Send, Loader2 } from 'lucide-react'

export default function ChatRoomPage() {
  const { userId } = useParams<{ userId: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const userName = (location.state as { userName?: string })?.userName || 'User'

  const onMessage = useCallback((msg: Record<string, unknown>) => {
    const senderId = (msg.sender as { id: string })?.id || msg.sender_id
    if (senderId === userId) {
      setMessages((prev) => [...prev, msg as unknown as ChatMessage])
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [userId])

  const { sendMessage: wsSendMessage } = useWebSocket({ onMessage })

  useEffect(() => {
    if (!userId) return
    getChatHistory(userId)
      .then((data) => {
        setMessages(data.messages.reverse())
        markMessagesAsRead(userId).catch(() => {})
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !userId) return

    const text = input.trim()
    setInput('')
    setSending(true)

    // Optimistic update
    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: { id: user!.id, full_name: user!.full_name, avatar_url: user!.avatar_url },
      receiver: { id: userId, full_name: userName },
      message: text,
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])

    try {
      wsSendMessage(userId, text)
      await sendMessageApi(userId, text)
    } catch { /* keep optimistic message */ }
    finally { setSending(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-bg-card">
        <button onClick={() => navigate('/chat')} className="text-muted hover:text-ivory">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Avatar name={userName} size="sm" />
        <h2 className="text-sm font-semibold text-ivory">{userName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-muted text-sm py-8">No messages yet. Say hello!</p>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender.id === user?.id
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                isMine
                  ? 'bg-gold text-bg rounded-br-md'
                  : 'bg-bg-elevated text-ivory rounded-bl-md'
              }`}>
                <p className="text-sm">{msg.message}</p>
                <p className={`text-[10px] mt-1 ${isMine ? 'text-bg/60' : 'text-subtle'}`}>
                  {formatRelativeTime(msg.created_at)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-3 px-6 py-4 border-t border-border bg-bg-card">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-bg-elevated border border-border rounded-full px-5 py-2.5 text-sm text-ivory placeholder:text-subtle focus:outline-none focus:border-gold transition-colors"
        />
        <button type="submit" disabled={sending || !input.trim()}
          className="bg-gold hover:bg-gold-light text-bg p-2.5 rounded-full disabled:opacity-50 transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
