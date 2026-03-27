import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@/components/Avatar'
import { getStudents, activateStudent, deactivateStudent } from '@/api/admin'
import { formatRelativeTime } from '@/lib/utils'
import type { User } from '@/types'
import { Search, Plus, Loader2, UserCheck, UserX } from 'lucide-react'

export default function StudentListPage() {
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchStudents = async (p = 1, q = '') => {
    setLoading(true)
    try {
      const data = await getStudents(p, 20, q)
      setStudents(data.users)
      setTotalPages(data.total_pages)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchStudents() }, [])

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchStudents(1, search) }, 400)
    return () => clearTimeout(timer)
  }, [search])

  const toggleStatus = async (student: User) => {
    if (!confirm(`${student.is_active ? 'Deactivate' : 'Activate'} ${student.full_name}?`)) return
    try {
      if (student.is_active) await deactivateStudent(student.id)
      else await activateStudent(student.id)
      setStudents((prev) => prev.map((s) => s.id === student.id ? { ...s, is_active: !s.is_active } : s))
    } catch { /* ignore */ }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)]">Students</h1>
        <Link to="/admin/students/create"
          className="flex items-center gap-2 bg-gold hover:bg-gold-light text-bg px-4 py-2 rounded-full text-sm font-semibold transition-colors no-underline">
          <Plus className="w-4 h-4" /> Invite Student
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students..."
          className="w-full bg-bg-card border border-border rounded-lg py-2.5 px-10 text-sm text-ivory placeholder:text-subtle focus:outline-none focus:border-gold transition-colors" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>
      ) : students.length === 0 ? (
        <p className="text-center text-muted py-12">No students found</p>
      ) : (
        <div className="space-y-2">
          {students.map((student) => (
            <div key={student.id} className="flex items-center gap-3 bg-bg-card border border-border rounded-xl p-4">
              <Avatar name={student.full_name} url={student.avatar_url} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-ivory">{student.full_name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    student.is_active ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
                  }`}>
                    {student.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-muted">{student.email}</p>
                <p className="text-[11px] text-subtle">Joined {formatRelativeTime(student.created_at)}</p>
              </div>
              <button onClick={() => toggleStatus(student)}
                className={`p-2 rounded-lg transition-colors ${
                  student.is_active
                    ? 'text-muted hover:text-error hover:bg-error/10'
                    : 'text-muted hover:text-success hover:bg-success/10'
                }`}
                title={student.is_active ? 'Deactivate' : 'Activate'}>
                {student.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              </button>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button disabled={page <= 1} onClick={() => { setPage(page - 1); fetchStudents(page - 1, search) }}
                className="text-sm text-gold disabled:text-subtle px-3 py-1">Prev</button>
              <span className="text-sm text-muted">{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => { setPage(page + 1); fetchStudents(page + 1, search) }}
                className="text-sm text-gold disabled:text-subtle px-3 py-1">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
