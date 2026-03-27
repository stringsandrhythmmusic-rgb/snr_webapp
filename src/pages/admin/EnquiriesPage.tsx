import { useState, useEffect } from 'react'
import { getEnquiries, updateEnquiry } from '@/api/admin'
import { formatRelativeTime } from '@/lib/utils'
import type { Enquiry } from '@/types'
import { MessageSquare, CheckCircle, Clock, X, Loader2 } from 'lucide-react'

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getEnquiries().then((data) => setEnquiries(data.enquiries)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleResolve = async () => {
    if (!selected) return
    setSaving(true)
    try {
      const updated = await updateEnquiry(selected.id, { is_resolved: true, admin_notes: notes })
      setEnquiries((prev) => prev.map((e) => e.id === updated.id ? updated : e))
      setSelected(null)
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)] mb-6">Enquiries</h1>

      {enquiries.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-subtle" />
          <p>No enquiries yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enquiries.map((enq) => (
            <button key={enq.id} onClick={() => { setSelected(enq); setNotes(enq.admin_notes || '') }}
              className="w-full bg-bg-card border border-border rounded-xl p-4 text-left hover:border-border-light transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ivory">{enq.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    enq.is_resolved ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                  }`}>
                    {enq.is_resolved ? <><CheckCircle className="w-3 h-3" /> Resolved</> : <><Clock className="w-3 h-3" /> Pending</>}
                  </span>
                </div>
                <span className="text-[11px] text-subtle">{formatRelativeTime(enq.created_at)}</span>
              </div>
              <p className="text-xs text-muted">{enq.email}</p>
              {enq.subject && <p className="text-sm text-ivory/80 mt-1">{enq.subject}</p>}
              <p className="text-xs text-muted mt-1 truncate">{enq.message}</p>
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-ivory">Enquiry Details</h2>
              <button onClick={() => setSelected(null)} className="text-subtle hover:text-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div><span className="text-subtle">Name:</span> <span className="text-ivory ml-2">{selected.name}</span></div>
              <div><span className="text-subtle">Email:</span> <span className="text-ivory ml-2">{selected.email}</span></div>
              {selected.phone && <div><span className="text-subtle">Phone:</span> <span className="text-ivory ml-2">{selected.phone}</span></div>}
              {selected.subject && <div><span className="text-subtle">Subject:</span> <span className="text-ivory ml-2">{selected.subject}</span></div>}
              <div>
                <span className="text-subtle block mb-1">Message:</span>
                <p className="text-ivory/90 bg-bg-elevated rounded-lg p-3 whitespace-pre-wrap">{selected.message}</p>
              </div>

              {!selected.is_resolved && (
                <>
                  <div>
                    <label className="label-mono block mb-2">Admin Notes</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                      placeholder="Add notes..."
                      className="w-full bg-bg-elevated border border-border rounded-lg p-3 text-sm text-ivory placeholder:text-subtle focus:outline-none focus:border-gold resize-none" />
                  </div>
                  <button onClick={handleResolve} disabled={saving}
                    className="w-full bg-success hover:bg-success/80 text-white font-semibold py-2.5 rounded-full transition-colors disabled:opacity-50">
                    {saving ? 'Resolving...' : 'Mark as Resolved'}
                  </button>
                </>
              )}
              {selected.is_resolved && selected.admin_notes && (
                <div>
                  <span className="text-subtle block mb-1">Admin Notes:</span>
                  <p className="text-ivory/90 bg-bg-elevated rounded-lg p-3">{selected.admin_notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
