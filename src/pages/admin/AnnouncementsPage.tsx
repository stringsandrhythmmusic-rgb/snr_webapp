import { useState } from 'react'
import { createAnnouncement } from '@/api/notifications'
import { Megaphone, CheckCircle, Loader2 } from 'lucide-react'

export default function AnnouncementsPage() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!title.trim()) { setError('Title is required'); return }
    if (message.trim().length < 10) { setError('Message must be at least 10 characters'); return }

    setLoading(true)
    try {
      await createAnnouncement(title.trim(), message.trim())
      setSuccess('Announcement sent to all users!')
      setTitle('')
      setMessage('')
    } catch {
      setError('Failed to send announcement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gold/10 text-gold rounded-lg flex items-center justify-center">
          <Megaphone className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)]">Send Announcement</h1>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-4 mb-6 text-sm text-muted">
        This will send a notification to all users in the academy.
      </div>

      {success && (
        <div className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {success}
        </div>
      )}
      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-mono block mb-2">Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement title"
            className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-4 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="label-mono block mb-2">Message *</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
            placeholder="Write your announcement (min 10 characters)..."
            className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-4 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold resize-none" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-gold hover:bg-gold-light text-bg font-semibold py-3 rounded-full transition-colors disabled:opacity-50">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Sending...</> : 'Send Announcement'}
        </button>
      </form>
    </div>
  )
}
