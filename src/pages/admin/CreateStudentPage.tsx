import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStudent } from '@/api/admin'
import { ArrowLeft, Mail, User, Phone, Loader2, CheckCircle } from 'lucide-react'

export default function CreateStudentPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', fullName: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.fullName) { setError('Email and name are required'); return }

    setLoading(true)
    try {
      const result = await createStudent({ email: form.email, full_name: form.fullName, phone: form.phone || undefined })
      setSuccess(result.message || 'Student invited successfully!')
      setForm({ email: '', fullName: '', phone: '' })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg || 'Failed to invite student')
    } finally {
      setLoading(false)
    }
  }

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }))

  return (
    <div className="max-w-lg mx-auto p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-ivory mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)] mb-6">Invite Student</h1>

      {success && (
        <div className="bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {success}
        </div>
      )}
      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
      )}

      <div className="bg-bg-card border border-border rounded-xl p-4 mb-6 text-sm text-muted">
        An invitation email will be sent. The link expires in 72 hours.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label-mono block mb-2">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
              placeholder="student@example.com"
              className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-10 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold" />
          </div>
        </div>
        <div>
          <label className="label-mono block mb-2">Full Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
            <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)}
              placeholder="Student name"
              className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-10 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold" />
          </div>
        </div>
        <div>
          <label className="label-mono block mb-2">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
            <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
              placeholder="Optional"
              className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-10 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-gold hover:bg-gold-light text-bg font-semibold py-3 rounded-full transition-colors disabled:opacity-50">
          {loading ? 'Sending...' : 'Send Invitation'}
        </button>
      </form>
    </div>
  )
}
