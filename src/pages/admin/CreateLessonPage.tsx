import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLesson, createLesson, updateLesson, uploadAudio, uploadVideo } from '@/api/lessons'
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react'

export default function CreateLessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const isEditing = !!lessonId

  const [form, setForm] = useState({
    title: '', description: '', text_content: '', order: 1, duration_minutes: 0, is_published: false,
    audio_url: '', video_url: '',
  })
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [audioUploading, setAudioUploading] = useState(false)
  const [videoUploading, setVideoUploading] = useState(false)

  useEffect(() => {
    if (!lessonId) return
    getLesson(lessonId).then((l) => {
      setForm({
        title: l.title, description: l.description, text_content: l.text_content || '',
        order: l.order, duration_minutes: l.duration_minutes || 0, is_published: l.is_published,
        audio_url: l.audio_url || '', video_url: l.video_url || '',
      })
    }).catch(() => navigate('/admin/lessons')).finally(() => setLoading(false))
  }, [lessonId, navigate])

  const update = (field: string, value: string | number | boolean) => setForm((p) => ({ ...p, [field]: value }))

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAudioUploading(true)
    try {
      const result = await uploadAudio(file)
      update('audio_url', result.url)
    } catch { setError('Audio upload failed') }
    finally { setAudioUploading(false) }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setVideoUploading(true)
    try {
      const result = await uploadVideo(file)
      update('video_url', result.url)
    } catch { setError('Video upload failed') }
    finally { setVideoUploading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description) { setError('Title and description required'); return }

    setSaving(true)
    try {
      const data = {
        title: form.title, description: form.description,
        text_content: form.text_content || undefined,
        order: form.order, duration_minutes: form.duration_minutes || undefined,
        is_published: form.is_published,
        audio_url: form.audio_url || undefined, video_url: form.video_url || undefined,
      }
      if (isEditing) await updateLesson(lessonId!, data)
      else await createLesson(data)
      navigate('/admin/lessons')
    } catch {
      setError('Failed to save lesson')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-ivory mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)] mb-6">
        {isEditing ? 'Edit Lesson' : 'Create Lesson'}
      </h1>

      {error && <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-mono block mb-2">Title *</label>
          <input value={form.title} onChange={(e) => update('title', e.target.value)}
            className="w-full bg-bg-card border border-border rounded-lg py-3 px-4 text-ivory focus:outline-none focus:border-gold" />
        </div>

        <div>
          <label className="label-mono block mb-2">Description *</label>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3}
            className="w-full bg-bg-card border border-border rounded-lg py-3 px-4 text-ivory focus:outline-none focus:border-gold resize-none" />
        </div>

        <div>
          <label className="label-mono block mb-2">Text Content / Notes</label>
          <textarea value={form.text_content} onChange={(e) => update('text_content', e.target.value)} rows={5}
            placeholder="Lesson notes, instructions, etc."
            className="w-full bg-bg-card border border-border rounded-lg py-3 px-4 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-mono block mb-2">Order</label>
            <input type="number" value={form.order} onChange={(e) => update('order', parseInt(e.target.value) || 1)}
              className="w-full bg-bg-card border border-border rounded-lg py-3 px-4 text-ivory focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="label-mono block mb-2">Duration (min)</label>
            <input type="number" value={form.duration_minutes} onChange={(e) => update('duration_minutes', parseInt(e.target.value) || 0)}
              className="w-full bg-bg-card border border-border rounded-lg py-3 px-4 text-ivory focus:outline-none focus:border-gold" />
          </div>
        </div>

        {/* Audio upload */}
        <div>
          <label className="label-mono block mb-2">Audio File</label>
          {form.audio_url ? (
            <div className="flex items-center gap-2 bg-bg-elevated rounded-lg px-4 py-2 text-sm text-muted">
              <span className="truncate flex-1">Audio uploaded</span>
              <button type="button" onClick={() => update('audio_url', '')} className="text-subtle hover:text-error"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <label className="flex items-center gap-2 px-4 py-3 bg-bg-card border border-border border-dashed rounded-lg text-sm text-muted hover:border-gold cursor-pointer">
              {audioUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {audioUploading ? 'Uploading...' : 'Upload Audio'}
              <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" disabled={audioUploading} />
            </label>
          )}
        </div>

        {/* Video upload */}
        <div>
          <label className="label-mono block mb-2">Video File</label>
          {form.video_url ? (
            <div className="flex items-center gap-2 bg-bg-elevated rounded-lg px-4 py-2 text-sm text-muted">
              <span className="truncate flex-1">Video uploaded</span>
              <button type="button" onClick={() => update('video_url', '')} className="text-subtle hover:text-error"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <label className="flex items-center gap-2 px-4 py-3 bg-bg-card border border-border border-dashed rounded-lg text-sm text-muted hover:border-gold cursor-pointer">
              {videoUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {videoUploading ? 'Uploading...' : 'Upload Video'}
              <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" disabled={videoUploading} />
            </label>
          )}
        </div>

        {/* Publish toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div className={`w-11 h-6 rounded-full relative transition-colors ${form.is_published ? 'bg-gold' : 'bg-bg-elevated border border-border'}`}
            onClick={() => update('is_published', !form.is_published)}>
            <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${form.is_published ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-sm text-ivory">Publish immediately</span>
        </label>

        <button type="submit" disabled={saving}
          className="w-full bg-gold hover:bg-gold-light text-bg font-semibold py-3 rounded-full transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : isEditing ? 'Update Lesson' : 'Create Lesson'}
        </button>
      </form>
    </div>
  )
}
