import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Avatar from '@/components/Avatar'
import { getPost, likePost, unlikePost, addComment, deleteComment } from '@/api/feeds'
import { formatRelativeTime } from '@/lib/utils'
import type { Post, Comment } from '@/types'
import { Heart, ArrowLeft, Send, Trash2, Loader2, Megaphone } from 'lucide-react'
import { BASE_URL } from '@/api/client'

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!postId) return
    getPost(postId).then(setPost).catch(() => navigate('/feed')).finally(() => setLoading(false))
  }, [postId, navigate])

  const handleLike = async () => {
    if (!post) return
    setPost({ ...post, is_liked: !post.is_liked, like_count: post.is_liked ? post.like_count - 1 : post.like_count + 1 })
    try {
      if (post.is_liked) await unlikePost(post.id)
      else await likePost(post.id)
    } catch { setPost(post) }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !post) return
    setSubmitting(true)
    try {
      const newComment = await addComment(post.id, comment.trim()) as unknown as Comment
      setPost({ ...post, comments: [...(post.comments || []), newComment], comment_count: post.comment_count + 1 })
      setComment('')
    } catch { /* ignore */ }
    finally { setSubmitting(false) }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!post || !confirm('Delete this comment?')) return
    try {
      await deleteComment(commentId)
      setPost({
        ...post,
        comments: (post.comments || []).filter((c) => c.id !== commentId),
        comment_count: post.comment_count - 1,
      })
    } catch { /* ignore */ }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>
  if (!post) return null

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted hover:text-ivory mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Post */}
      <div className="bg-bg-card border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar name={post.author.full_name} url={post.author.avatar_url} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-ivory">{post.author.full_name}</span>
              {post.author.role === 'admin' && (
                <span className="text-[10px] bg-gold/15 text-gold px-2 py-0.5 rounded-full">Admin</span>
              )}
              {post.is_announcement && <Megaphone className="w-3.5 h-3.5 text-gold" />}
            </div>
            <span className="text-xs text-subtle">{formatRelativeTime(post.created_at)}</span>
          </div>
        </div>

        {post.content && <p className="text-ivory/90 mb-4 whitespace-pre-wrap">{post.content}</p>}

        {post.media_url && post.media_type === 'image' && (
          <img src={post.media_url.startsWith('http') ? post.media_url : `${BASE_URL}${post.media_url}`}
            alt="" className="w-full rounded-lg mb-4 max-h-[500px] object-cover" />
        )}
        {post.media_url && post.media_type === 'video' && (
          <video src={post.media_url.startsWith('http') ? post.media_url : `${BASE_URL}${post.media_url}`}
            controls className="w-full rounded-lg mb-4" />
        )}

        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <button onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm ${post.is_liked ? 'text-error' : 'text-muted hover:text-error'}`}>
            <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} /> {post.like_count}
          </button>
          <span className="text-sm text-muted">{post.comment_count} comments</span>
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-3 mb-6">
        {(post.comments || []).map((c) => (
          <div key={c.id} className="bg-bg-elevated rounded-lg p-4 flex gap-3">
            <Avatar name={c.author.full_name} url={c.author.avatar_url} size="sm" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ivory">{c.author.full_name}</span>
                  <span className="text-xs text-subtle">{formatRelativeTime(c.created_at)}</span>
                </div>
                {(c.author.id === user?.id || user?.role === 'admin') && (
                  <button onClick={() => handleDeleteComment(c.id)}
                    className="text-subtle hover:text-error transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm text-ivory/80 mt-1">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comment input */}
      <form onSubmit={handleComment} className="flex gap-3">
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-bg-elevated border border-border rounded-lg px-4 py-3 text-sm text-ivory placeholder:text-subtle focus:outline-none focus:border-gold transition-colors"
        />
        <button type="submit" disabled={submitting || !comment.trim()}
          className="bg-gold hover:bg-gold-light text-bg p-3 rounded-lg disabled:opacity-50 transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
