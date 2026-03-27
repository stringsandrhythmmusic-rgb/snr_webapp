import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Avatar from '@/components/Avatar'
import { getPosts, likePost, unlikePost } from '@/api/feeds'
import { formatRelativeTime } from '@/lib/utils'
import type { Post } from '@/types'
import { Heart, MessageCircle, Plus, Megaphone, Loader2, Image as ImageIcon } from 'lucide-react'
import { BASE_URL } from '@/api/client'

export default function FeedPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = useCallback(async (p = 1) => {
    try {
      const data = await getPosts(p)
      if (p === 1) setPosts(data.posts)
      else setPosts((prev) => [...prev, ...data.posts])
      setHasMore(p < data.total_pages)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleLike = async (post: Post) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, is_liked: !p.is_liked, like_count: p.is_liked ? p.like_count - 1 : p.like_count + 1 }
          : p
      )
    )
    try {
      if (post.is_liked) await unlikePost(post.id)
      else await likePost(post.id)
    } catch {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, is_liked: post.is_liked, like_count: post.like_count } : p))
      )
    }
  }

  const loadMore = () => {
    if (!hasMore) return
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)]">Feed</h1>
        <Link to="/feed/create"
          className="flex items-center gap-2 bg-gold hover:bg-gold-light text-bg px-4 py-2 rounded-full text-sm font-semibold transition-colors no-underline">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-subtle" />
          <p>No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-bg-card border border-border rounded-xl p-5">
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={post.author.full_name} url={post.author.avatar_url} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ivory">{post.author.full_name}</span>
                    {post.author.role === 'admin' && (
                      <span className="text-[10px] bg-gold/15 text-gold px-2 py-0.5 rounded-full">Admin</span>
                    )}
                    {post.is_announcement && (
                      <Megaphone className="w-3.5 h-3.5 text-gold" />
                    )}
                  </div>
                  <span className="text-xs text-subtle">{formatRelativeTime(post.created_at)}</span>
                </div>
              </div>

              {/* Content */}
              {post.content && <p className="text-sm text-ivory/90 mb-3 whitespace-pre-wrap">{post.content}</p>}

              {/* Media */}
              {post.media_url && post.media_type === 'image' && (
                <img
                  src={post.media_url.startsWith('http') ? post.media_url : `${BASE_URL}${post.media_url}`}
                  alt="Post media"
                  className="w-full rounded-lg mb-3 max-h-96 object-cover"
                />
              )}
              {post.media_url && post.media_type === 'video' && (
                <video
                  src={post.media_url.startsWith('http') ? post.media_url : `${BASE_URL}${post.media_url}`}
                  controls
                  className="w-full rounded-lg mb-3 max-h-96"
                />
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-3 border-t border-border">
                <button
                  onClick={() => handleLike(post)}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${
                    post.is_liked ? 'text-error' : 'text-muted hover:text-error'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-current' : ''}`} />
                  {post.like_count}
                </button>
                <Link
                  to={`/feed/${post.id}`}
                  className="flex items-center gap-1.5 text-sm text-muted hover:text-info transition-colors no-underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  {post.comment_count}
                </Link>
              </div>
            </div>
          ))}

          {hasMore && (
            <button onClick={loadMore}
              className="w-full py-3 text-sm text-gold hover:text-gold-light transition-colors">
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  )
}
