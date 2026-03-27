import { useState } from 'react'
import { Link } from 'react-router-dom'
import { submitEnquiry } from '@/api/enquiry'
import { Music, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'

export default function EnquiryPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.message) { setError('Name, email, and message are required'); return }
    if (form.message.length < 10) { setError('Message must be at least 10 characters'); return }

    setLoading(true)
    try {
      await submitEnquiry({
        name: form.name, email: form.email,
        phone: form.phone || undefined, subject: form.subject || undefined,
        message: form.message,
      })
      setSuccess(true)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg || 'Failed to submit enquiry')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-bold text-ivory mb-2">Enquiry Sent!</h2>
          <p className="text-muted mb-6">Thank you for reaching out. We'll get back to you soon.</p>
          <Link to="/login" className="text-gold hover:text-gold-light text-sm no-underline">Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-muted hover:text-ivory mb-6 text-sm no-underline">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Music className="w-7 h-7 text-bg" />
          </div>
          <h2 className="text-2xl font-bold text-ivory">Send an Enquiry</h2>
          <p className="text-muted mt-1">We'd love to hear from you</p>
        </div>

        {error && <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-mono block mb-2">Name *</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name"
              className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-4 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="label-mono block mb-2">Email *</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com"
              className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-4 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="label-mono block mb-2">Phone</label>
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Optional"
              className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-4 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="label-mono block mb-2">Subject</label>
            <input value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="Optional"
              className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-4 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="label-mono block mb-2">Message *</label>
            <textarea value={form.message} onChange={(e) => update('message', e.target.value)} rows={4}
              placeholder="Tell us what you're looking for..."
              className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-4 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold resize-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gold hover:bg-gold-light text-bg font-semibold py-3 rounded-full transition-colors disabled:opacity-50">
            {loading ? 'Sending...' : 'Send Enquiry'}
          </button>
        </form>
      </div>
    </div>
  )
}
