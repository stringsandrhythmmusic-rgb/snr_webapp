import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import Layout from '@/components/Layout'

// Auth pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import SetPasswordPage from '@/pages/auth/SetPasswordPage'

// Main pages
import FeedPage from '@/pages/FeedPage'
import PostDetailPage from '@/pages/PostDetailPage'
import CreatePostPage from '@/pages/CreatePostPage'
import LessonsPage from '@/pages/LessonsPage'
import LessonDetailPage from '@/pages/LessonDetailPage'
import ChatPage from '@/pages/ChatPage'
import ChatRoomPage from '@/pages/ChatRoomPage'
import NotificationsPage from '@/pages/NotificationsPage'
import ProfilePage from '@/pages/ProfilePage'

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard'
import StudentListPage from '@/pages/admin/StudentListPage'
import EnquiriesPage from '@/pages/admin/EnquiriesPage'
import ManageLessonsPage from '@/pages/admin/ManageLessonsPage'
import CreateLessonPage from '@/pages/admin/CreateLessonPage'
import AnnouncementsPage from '@/pages/admin/AnnouncementsPage'
import CreateStudentPage from '@/pages/admin/CreateStudentPage'

// Guest pages
import GuestFeedPage from '@/pages/guest/GuestFeedPage'
import EnquiryPage from '@/pages/guest/EnquiryPage'
import StudentDirectoryPage from '@/pages/guest/StudentDirectoryPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="flex items-center justify-center h-screen bg-bg"><div className="text-gold">Loading...</div></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/feed" replace />
  return <>{children}</>
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  if (isAuthenticated) return <Navigate to="/feed" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/set-password/:token" element={<SetPasswordPage />} />

      {/* Guest routes */}
      <Route path="/guest" element={<GuestFeedPage />} />
      <Route path="/enquiry" element={<EnquiryPage />} />
      <Route path="/directory" element={<StudentDirectoryPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/feed/:postId" element={<PostDetailPage />} />
        <Route path="/feed/create" element={<CreatePostPage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lessons/:lessonId" element={<LessonDetailPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:userId" element={<ChatRoomPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/students" element={<AdminRoute><StudentListPage /></AdminRoute>} />
        <Route path="/admin/students/create" element={<AdminRoute><CreateStudentPage /></AdminRoute>} />
        <Route path="/admin/enquiries" element={<AdminRoute><EnquiriesPage /></AdminRoute>} />
        <Route path="/admin/lessons" element={<AdminRoute><ManageLessonsPage /></AdminRoute>} />
        <Route path="/admin/lessons/create" element={<AdminRoute><CreateLessonPage /></AdminRoute>} />
        <Route path="/admin/lessons/:lessonId/edit" element={<AdminRoute><CreateLessonPage /></AdminRoute>} />
        <Route path="/admin/announcements" element={<AdminRoute><AnnouncementsPage /></AdminRoute>} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
