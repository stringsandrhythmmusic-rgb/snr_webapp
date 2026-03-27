import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@/components/Avatar'
import { getStudentDirectory } from '@/api/users'
import type { User } from '@/types'
import { Search, ArrowLeft, Users, Loader2 } from 'lucide-react'

export default function StudentDirectoryPage() {
  const [students, setStudents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)

  const fetchStudents = async (q = '') => {
    setLoading(true)
    try {
      const data = await getStudentDirectory(1, 50, q)
      setStudents(data.users)
      setTotal(data.total)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchStudents() }, [])

  useEffect(() => {
    const timer = setTimeout(() => fetchStudents(search), 400)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-2xl mx-auto p-6">
        <Link to="/login" className="flex items-center gap-2 text-muted hover:text-ivory mb-6 text-sm no-underline">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gold/10 text-gold rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ivory font-[family-name:var(--font-display)]">Student Directory</h1>
            <p className="text-xs text-muted">{total} students</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-subtle" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full bg-bg-card border border-border rounded-lg py-2.5 px-10 text-sm text-ivory placeholder:text-subtle focus:outline-none focus:border-gold" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32"><Loader2 className="w-6 h-6 text-gold animate-spin" /></div>
        ) : students.length === 0 ? (
          <p className="text-center text-muted py-12">No students found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {students.map((student) => (
              <div key={student.id} className="flex items-center gap-3 bg-bg-card border border-border rounded-xl p-4">
                <Avatar name={student.full_name} url={student.avatar_url} size="md" />
                <div>
                  <p className="text-sm font-semibold text-ivory">{student.full_name}</p>
                  <span className="text-[10px] text-gold bg-gold/10 px-2 py-0.5 rounded-full">Student</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
