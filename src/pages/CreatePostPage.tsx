import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { createPost } from '@/api/feeds'
import { ArrowLeft, Image as ImageIcon, Video, X, Loader2 } from 'lucide-react'

export default function CreatePostPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnnouncement, setIsAnnouncement] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    if (f.type.startsWith('image/')) setPreview(URL.createObjectURL(f))
    else setPreview(null)
  }

  const removeFile = () => { setFile(null); setPreview(null) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() && !file) { setError('Add some content or media'); return }

    setLoading(true)
    try {
      const formData = new FormData()
      if (content.trim()) formData.append('content', content.trim())
      if (isAnnouncement) formData.append('is_announcement', 'true')
      if (file) formData.append('file', file)
      await createPost(formData)
      navigate('/feed')
    } catch {
      setError('Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-ivory mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)] mb-6">Create Post</h1>

      {error && (
        <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={5}
          className="w-full bg-bg-card border border-border rounded-xl p-4 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold transition-colors resize-none"
        />

        {preview && (
          <div className="relative inline-block">
            <img src={preview} alt="Preview" className="max-h-48 rounded-lg" />
            <button type="button" onClick={removeFile}
              className="absolute -top-2 -right-2 bg-bg-elevated border border-border rounded-full p-1 text-muted hover:text-error">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {file && !preview && (
          <div className="flex items-center gap-2 bg-bg-elevated rounded-lg px-4 py-2 text-sm text-muted">
            <Video className="w-4 h-4" />
            <span className="truncate">{file.name}</span>
            <button type="button" onClick={removeFile} className="ml-auto text-subtle hover:text-error">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 bg-bg-elevated border border-border rounded-lg text-sm text-muted hover:text-ivory cursor-pointer transition-colors">
            <ImageIcon className="w-4 h-4" /> Add Media
            <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
          </label>

          {isAdmin && (
            <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
              <input type="checkbox" checked={isAnnouncement} onChange={(e) => setIsAnnouncement(e.target.checked)}
                className="rounded border-border accent-gold" />
              Announcement
            </label>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="bg-gold hover:bg-gold-light text-bg font-semibold px-8 py-3 rounded-full transition-colors disabled:opacity-50">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Posting...</> : 'Post'}
        </button>
      </form>
    </div>
  )
}
