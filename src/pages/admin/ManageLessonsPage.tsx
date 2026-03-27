import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLessons, deleteLesson } from '@/api/lessons'
import type { Lesson } from '@/types'
import { Plus, Edit2, Trash2, BookOpen, Video, Music, FileText, Loader2 } from 'lucide-react'

export default function ManageLessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    getLessons().then((data) => setLessons(data.lessons)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await deleteLesson(id)
      setLessons((prev) => prev.filter((l) => l.id !== id))
    } catch { /* ignore */ }
  }

  const filtered = lessons.filter((l) => {
    if (filter === 'published') return l.is_published
    if (filter === 'draft') return !l.is_published
    return true
  })

  const counts = {
    all: lessons.length,
    published: lessons.filter((l) => l.is_published).length,
    draft: lessons.filter((l) => !l.is_published).length,
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)]">Manage Lessons</h1>
        <Link to="/admin/lessons/create"
          className="flex items-center gap-2 bg-gold hover:bg-gold-light text-bg px-4 py-2 rounded-full text-sm font-semibold transition-colors no-underline">
          <Plus className="w-4 h-4" /> Add Lesson
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-bg-card rounded-lg p-1 mb-6">
        {(['all', 'published', 'draft'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex-1 py-2 text-sm rounded-md transition-colors capitalize ${
              filter === f ? 'bg-bg-elevated text-ivory' : 'text-muted hover:text-ivory'
            }`}>
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-subtle" />
          <p>No lessons found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lesson) => (
            <div key={lesson.id} className="bg-bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-gold/10 text-gold rounded-lg flex items-center justify-center shrink-0">
                <span className="text-sm font-bold">{lesson.order}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ivory">{lesson.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    lesson.is_published ? 'bg-success/15 text-success' : 'bg-subtle/15 text-subtle'
                  }`}>
                    {lesson.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-muted truncate mt-0.5">{lesson.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  {lesson.video_url && <Video className="w-3 h-3 text-subtle" />}
                  {lesson.audio_url && <Music className="w-3 h-3 text-subtle" />}
                  {lesson.text_content && <FileText className="w-3 h-3 text-subtle" />}
                  {lesson.duration_minutes && <span className="text-[10px] text-subtle">{lesson.duration_minutes}m</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link to={`/admin/lessons/${lesson.id}/edit`}
                  className="p-2 text-muted hover:text-gold rounded-lg hover:bg-bg-elevated transition-colors">
                  <Edit2 className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(lesson.id, lesson.title)}
                  className="p-2 text-muted hover:text-error rounded-lg hover:bg-error/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
