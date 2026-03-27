import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLesson, getLessonProgress, updateLessonProgress } from '@/api/lessons'
import type { Lesson, LessonProgress } from '@/types'
import { ArrowLeft, CheckCircle, Clock, Play, Loader2 } from 'lucide-react'
import { BASE_URL } from '@/api/client'

export default function LessonDetailPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [progress, setProgress] = useState<LessonProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const lastSavedPosition = useRef(0)

  useEffect(() => {
    if (!lessonId) return
    Promise.all([getLesson(lessonId), getLessonProgress(lessonId)])
      .then(([l, p]) => { setLesson(l); setProgress(p) })
      .catch(() => navigate('/lessons'))
      .finally(() => setLoading(false))
  }, [lessonId, navigate])

  const savePosition = (currentTime: number) => {
    if (!lessonId || Math.abs(currentTime - lastSavedPosition.current) < 5) return
    lastSavedPosition.current = currentTime
    updateLessonProgress(lessonId, { last_position: Math.floor(currentTime) }).catch(() => {})
  }

  const handleComplete = async () => {
    if (!lessonId) return
    setCompleting(true)
    try {
      const p = await updateLessonProgress(lessonId, { completed: true })
      setProgress(p)
    } catch { /* ignore */ }
    finally { setCompleting(false) }
  }

  const mediaUrl = (url: string | null) => {
    if (!url) return ''
    return url.startsWith('http') ? url : `${BASE_URL}${url}`
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>
  if (!lesson) return null

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-ivory mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Lessons
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)]">{lesson.title}</h1>
          <p className="text-muted mt-1">{lesson.description}</p>
          <div className="flex items-center gap-3 mt-3">
            {lesson.duration_minutes && (
              <span className="flex items-center gap-1 text-xs text-subtle bg-bg-elevated px-2.5 py-1 rounded-full">
                <Clock className="w-3 h-3" /> {lesson.duration_minutes} min
              </span>
            )}
            {progress?.completed && (
              <span className="flex items-center gap-1 text-xs text-success bg-success/10 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" /> Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Video */}
      {lesson.video_url && (
        <div className="mb-6">
          <p className="label-mono mb-2">Video Lesson</p>
          <video
            ref={videoRef}
            src={mediaUrl(lesson.video_url)}
            controls
            className="w-full rounded-xl bg-black"
            onTimeUpdate={(e) => savePosition(e.currentTarget.currentTime)}
          />
        </div>
      )}

      {/* Audio */}
      {lesson.audio_url && (
        <div className="mb-6">
          <p className="label-mono mb-2">Audio Lesson</p>
          <div className="bg-bg-card border border-border rounded-xl p-4">
            <audio
              ref={audioRef}
              src={mediaUrl(lesson.audio_url)}
              controls
              className="w-full"
              onTimeUpdate={(e) => savePosition(e.currentTarget.currentTime)}
            />
          </div>
        </div>
      )}

      {/* Text content */}
      {lesson.text_content && (
        <div className="mb-6">
          <p className="label-mono mb-2">Notes</p>
          <div className="bg-bg-card border border-border rounded-xl p-5 text-ivory/90 text-sm whitespace-pre-wrap leading-relaxed">
            {lesson.text_content}
          </div>
        </div>
      )}

      {/* Mark complete */}
      {!progress?.completed && (
        <button onClick={handleComplete} disabled={completing}
          className="bg-gold hover:bg-gold-light text-bg font-semibold px-8 py-3 rounded-full transition-colors disabled:opacity-50">
          {completing ? 'Marking...' : 'Mark as Complete'}
        </button>
      )}
    </div>
  )
}
