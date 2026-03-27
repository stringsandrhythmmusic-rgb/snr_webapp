import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Music, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields'); return }

    setLoading(true)
    try {
      await login(email, password)
      navigate('/feed')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-bg-card items-center justify-center relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-burgundy/10 rounded-full blur-3xl" />
        <div className="text-center z-10 px-12">
          <div className="w-20 h-20 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Music className="w-10 h-10 text-bg" />
          </div>
          <h1 className="text-4xl font-bold text-ivory font-[family-name:var(--font-display)] mb-4">
            Strings & Rhythm
          </h1>
          <p className="text-lg text-muted">Music Academy</p>
          <p className="text-sm text-subtle mt-6 max-w-sm mx-auto">
            Your journey to musical mastery starts here. Learn guitar from world-class instructors.
          </p>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-bg" />
            </div>
            <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)]">
              Strings & Rhythm
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-ivory mb-2">Welcome back</h2>
          <p className="text-muted mb-8">Sign in to continue to your account</p>

          {error && (
            <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-mono block mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-10 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="label-mono block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-10 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-muted"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-light text-bg font-semibold py-3 rounded-full transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-muted text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold hover:text-gold-light">
                Register
              </Link>
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-subtle text-xs">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <Link
              to="/guest"
              className="block text-sm text-muted hover:text-ivory transition-colors"
            >
              Continue as Guest
            </Link>
            <Link
              to="/enquiry"
              className="block text-sm text-gold hover:text-gold-light transition-colors"
            >
              Send an Enquiry
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
