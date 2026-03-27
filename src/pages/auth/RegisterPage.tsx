import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Music, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.fullName || !form.email || !form.password) {
      setError('Please fill in all required fields'); return
    }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }

    setLoading(true)
    try {
      await register(form.email, form.password, form.fullName, form.phone || undefined)
      navigate('/feed')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }))

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Music className="w-7 h-7 text-bg" />
          </div>
          <h2 className="text-2xl font-bold text-ivory">Create Account</h2>
          <p className="text-muted mt-1">Join Strings & Rhythm Academy</p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-mono block mb-2">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
              <input type="text" value={form.fullName} onChange={(e) => update('fullName', e.target.value)}
                placeholder="Your full name"
                className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-10 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>

          <div>
            <label className="label-mono block mb-2">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-10 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>

          <div>
            <label className="label-mono block mb-2">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
              <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)}
                placeholder="Optional"
                className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-10 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>

          <div>
            <label className="label-mono block mb-2">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
              <input type={showPassword ? 'text' : 'password'} value={form.password}
                onChange={(e) => update('password', e.target.value)} placeholder="Min 6 characters"
                className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-10 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold transition-colors" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-muted">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="label-mono block mb-2">Confirm Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
              <input type="password" value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Repeat password"
                className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-10 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gold hover:bg-gold-light text-bg font-semibold py-3 rounded-full transition-colors disabled:opacity-50 mt-2">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-muted text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gold hover:text-gold-light">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
