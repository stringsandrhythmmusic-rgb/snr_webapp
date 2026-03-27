import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { verifyToken, setPassword } from '@/api/auth'
import { Music, Lock, Loader2 } from 'lucide-react'

export default function SetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [state, setState] = useState<'verifying' | 'valid' | 'invalid'>('verifying')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPasswordVal] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) { setState('invalid'); return }
    verifyToken(token)
      .then((res) => { setEmail(res.email); setName(res.full_name); setState('valid') })
      .catch(() => setState('invalid'))
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (password !== confirmPassword) { setError('Passwords do not match'); return }

    setLoading(true)
    try {
      const result = await setPassword({ token: token!, password, confirm_password: confirmPassword })
      localStorage.setItem('snr_auth_token', result.access_token)
      localStorage.setItem('snr_user_data', JSON.stringify(result.user))
      navigate('/feed')
      window.location.reload()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg || 'Failed to set password')
    } finally {
      setLoading(false)
    }
  }

  if (state === 'verifying') {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    )
  }

  if (state === 'invalid') {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Music className="w-7 h-7 text-error" />
          </div>
          <h2 className="text-xl font-bold text-ivory mb-2">Invalid or Expired Link</h2>
          <p className="text-muted mb-6">This invitation link is no longer valid. Please contact your admin.</p>
          <button onClick={() => navigate('/login')} className="text-gold hover:text-gold-light text-sm">
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Music className="w-7 h-7 text-bg" />
          </div>
          <h2 className="text-2xl font-bold text-ivory">Welcome, {name}!</h2>
          <p className="text-muted mt-1">Set your password to get started</p>
          <p className="text-subtle text-sm mt-2">{email}</p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/30 text-error px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-mono block mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
              <input type="password" value={password} onChange={(e) => setPasswordVal(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-10 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>
          <div>
            <label className="label-mono block mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-bg-elevated border border-border rounded-lg py-3 px-10 text-ivory placeholder:text-subtle focus:outline-none focus:border-gold transition-colors" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gold hover:bg-gold-light text-bg font-semibold py-3 rounded-full transition-colors disabled:opacity-50">
            {loading ? 'Setting Password...' : 'Set Password & Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
