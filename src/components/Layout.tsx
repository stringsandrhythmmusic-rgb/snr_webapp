import { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Avatar from './Avatar'
import {
  Home,
  BookOpen,
  MessageCircle,
  Bell,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Music,
} from 'lucide-react'

const studentLinks = [
  { to: '/feed', icon: Home, label: 'Feed' },
  { to: '/lessons', icon: BookOpen, label: 'Lessons' },
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/profile', icon: User, label: 'Profile' },
]

const adminLinks = [
  { to: '/admin', icon: Shield, label: 'Dashboard' },
  { to: '/admin/students', icon: User, label: 'Students' },
  { to: '/admin/enquiries', icon: MessageCircle, label: 'Enquiries' },
  { to: '/admin/lessons', icon: BookOpen, label: 'Lessons' },
  { to: '/admin/announcements', icon: Bell, label: 'Announcements' },
]

export default function Layout() {
  const { user, isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const links = isAdmin ? [...studentLinks, ...adminLinks] : studentLinks

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-bg-card border-r border-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <Link to="/feed" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
              <Music className="w-5 h-5 text-bg" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-ivory font-[family-name:var(--font-display)]">
                Strings & Rhythm
              </h1>
              <p className="text-[10px] text-muted tracking-wider uppercase">Academy</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {isAdmin && (
            <p className="label-mono px-3 mb-2 mt-2">Main</p>
          )}
          {studentLinks.map((link) => {
            const active = location.pathname === link.to || location.pathname.startsWith(link.to + '/')
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm no-underline transition-colors ${
                  active
                    ? 'bg-gold/10 text-gold'
                    : 'text-muted hover:text-ivory hover:bg-bg-hover'
                }`}
              >
                <link.icon className="w-[18px] h-[18px]" />
                {link.label}
              </Link>
            )
          })}

          {isAdmin && (
            <>
              <p className="label-mono px-3 mb-2 mt-6">Admin</p>
              {adminLinks.map((link) => {
                const active = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm no-underline transition-colors ${
                      active
                        ? 'bg-gold/10 text-gold'
                        : 'text-muted hover:text-ivory hover:bg-bg-hover'
                    }`}
                  >
                    <link.icon className="w-[18px] h-[18px]" />
                    {link.label}
                  </Link>
                )
              })}
            </>
          )}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <Avatar name={user?.full_name || ''} url={user?.avatar_url} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ivory truncate">{user?.full_name}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-muted hover:text-error rounded-lg hover:bg-bg-hover transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-bg-card border-b border-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-muted hover:text-ivory rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-gold" />
            <span className="text-sm font-semibold text-ivory">S&R Academy</span>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
