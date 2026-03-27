import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Avatar from '@/components/Avatar'
import { updateProfile, uploadAvatar } from '@/api/users'
import { Camera, Edit2, Save, X, Mail, Phone, Shield, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await updateProfile({ full_name: fullName, phone })
      updateUser(updated)
      setEditing(false)
    } catch { /* ignore */ }
    finally { setSaving(false) }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const updated = await uploadAvatar(file)
      updateUser(updated)
    } catch { /* ignore */ }
    finally { setUploading(false) }
  }

  if (!user) return null

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)] mb-8">Profile</h1>

      {/* Avatar section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <Avatar name={user.full_name} url={user.avatar_url} size="xl" />
          <label className="absolute bottom-0 right-0 w-8 h-8 bg-gold rounded-full flex items-center justify-center cursor-pointer hover:bg-gold-light transition-colors">
            {uploading ? <Loader2 className="w-4 h-4 text-bg animate-spin" /> : <Camera className="w-4 h-4 text-bg" />}
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </label>
        </div>
        <h2 className="text-lg font-semibold text-ivory mt-4">{user.full_name}</h2>
        <span className="flex items-center gap-1.5 text-xs text-gold bg-gold/10 px-3 py-1 rounded-full mt-1">
          <Shield className="w-3 h-3" /> {user.role === 'admin' ? 'Admin' : 'Student'}
        </span>
      </div>

      {/* Profile details */}
      <div className="bg-bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="label-mono">Personal Information</span>
          {!editing ? (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm text-gold hover:text-gold-light transition-colors">
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing(false); setFullName(user.full_name); setPhone(user.phone || '') }}
                className="text-subtle hover:text-ivory p-1.5"><X className="w-4 h-4" /></button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1 text-sm text-gold hover:text-gold-light disabled:opacity-50">
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-subtle block mb-1">Full Name</label>
            {editing ? (
              <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm text-ivory focus:outline-none focus:border-gold" />
            ) : (
              <p className="text-sm text-ivory">{user.full_name}</p>
            )}
          </div>

          <div>
            <label className="text-xs text-subtle flex items-center gap-1.5 mb-1"><Mail className="w-3 h-3" /> Email</label>
            <p className="text-sm text-ivory">{user.email}</p>
          </div>

          <div>
            <label className="text-xs text-subtle flex items-center gap-1.5 mb-1"><Phone className="w-3 h-3" /> Phone</label>
            {editing ? (
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="Add phone number"
                className="w-full bg-bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm text-ivory placeholder:text-subtle focus:outline-none focus:border-gold" />
            ) : (
              <p className="text-sm text-ivory">{user.phone || 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="text-xs text-subtle block mb-1">Member since</label>
            <p className="text-sm text-ivory">{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
