import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLessons, getLessonProgress } from '@/api/lessons'
import type { Lesson, LessonProgress } from '@/types'
import { BookOpen, Clock, CheckCircle, Play, Loader2 } from 'lucide-react'

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLessons().then(async (data) => {
      setLessons(data.lessons)
      const progressMap: Record<string, LessonProgress> = {}
      await Promise.all(
        data.lessons.map(async (l) => {
          const p = await getLessonProgress(l.id)
          if (p) progressMap[l.id] = p
        })
      )
      setProgress(progressMap)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const completed = Object.values(progress).filter((p) => p.completed).length
  const total = lessons.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)] mb-6">Lessons</h1>

      {/* Progress card */}
      {total > 0 && (
        <div className="bg-bg-card border border-border rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="label-mono">Your Progress</span>
            <span className="text-sm text-gold font-semibold">{completed}/{total} completed</span>
          </div>
          <div className="w-full bg-bg-elevated rounded-full h-2.5">
            <div className="bg-gold rounded-full h-2.5 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-subtle mt-2">{pct}% complete</p>
        </div>
      )}

      {lessons.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-subtle" />
          <p>No lessons available yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, i) => {
            const lessonProgress = progress[lesson.id]
            const isCompleted = lessonProgress?.completed
            return (
              <Link
                key={lesson.id}
                to={`/lessons/${lesson.id}`}
                className="flex items-center gap-4 bg-bg-card border border-border rounded-xl p-4 hover:border-border-light transition-colors no-underline group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  isCompleted ? 'bg-success/15 text-success' : 'bg-gold/10 text-gold'
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-bold">{lesson.order || i + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-ivory group-hover:text-gold transition-colors">{lesson.title}</h3>
                  <p className="text-xs text-muted truncate mt-0.5">{lesson.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {lesson.duration_minutes && (
                    <span className="flex items-center gap-1 text-xs text-subtle">
                      <Clock className="w-3 h-3" /> {lesson.duration_minutes}m
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-xs text-subtle">
                    {lesson.video_url && <Play className="w-3 h-3" />}
                    {lesson.audio_url && <span>🎵</span>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
