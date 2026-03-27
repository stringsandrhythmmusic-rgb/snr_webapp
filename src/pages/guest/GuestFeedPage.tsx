import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@/components/Avatar'
import { getPosts } from '@/api/feeds'
import { formatRelativeTime } from '@/lib/utils'
import type { Post } from '@/types'
import { Heart, MessageCircle, Music, LogIn, Megaphone, Loader2, Users, HelpCircle } from 'lucide-react'
import { BASE_URL } from '@/api/client'

export default function GuestFeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPosts(1, 20).then((data) => setPosts(data.posts)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-screen bg-bg"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-bg-card/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-gold" />
            <span className="text-sm font-bold text-ivory">S&R Academy</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/directory" className="text-xs text-muted hover:text-ivory flex items-center gap-1 no-underline">
              <Users className="w-3.5 h-3.5" /> Directory
            </Link>
            <Link to="/enquiry" className="text-xs text-muted hover:text-ivory flex items-center gap-1 no-underline">
              <HelpCircle className="w-3.5 h-3.5" /> Enquire
            </Link>
            <Link to="/login"
              className="flex items-center gap-1.5 bg-gold hover:bg-gold-light text-bg px-3 py-1.5 rounded-full text-xs font-semibold no-underline transition-colors">
              <LogIn className="w-3 h-3" /> Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Feed */}
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)] mb-6">Community Feed</h1>

        {posts.length === 0 ? (
          <p className="text-center text-muted py-16">No posts yet</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={post.author.full_name} url={post.author.avatar_url} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ivory">{post.author.full_name}</span>
                      {post.is_announcement && <Megaphone className="w-3.5 h-3.5 text-gold" />}
                    </div>
                    <span className="text-xs text-subtle">{formatRelativeTime(post.created_at)}</span>
                  </div>
                </div>

                {post.content && <p className="text-sm text-ivory/90 mb-3 whitespace-pre-wrap">{post.content}</p>}

                {post.media_url && post.media_type === 'image' && (
                  <img src={post.media_url.startsWith('http') ? post.media_url : `${BASE_URL}${post.media_url}`}
                    alt="" className="w-full rounded-lg mb-3 max-h-96 object-cover" />
                )}

                <div className="flex items-center gap-4 pt-3 border-t border-border">
                  <span className="flex items-center gap-1.5 text-sm text-muted">
                    <Heart className="w-4 h-4" /> {post.like_count}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted">
                    <MessageCircle className="w-4 h-4" /> {post.comment_count}
                  </span>
                  <Link to="/login" className="ml-auto text-xs text-gold hover:text-gold-light no-underline">
                    Sign in to interact
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
