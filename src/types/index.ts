export type UserRole = 'admin' | 'student'

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  role: UserRole
  is_active: boolean
  created_at: string
}

export interface AuthToken {
  access_token: string
  token_type: string
  user: User
}

export interface VerifyTokenResponse {
  valid: boolean
  email: string
  full_name: string
}

export type MediaType = 'text' | 'image' | 'video'

export interface Author {
  id: string
  full_name: string
  avatar_url?: string
  role: UserRole
}

export interface Comment {
  id: string
  content: string
  author: Author
  created_at: string
}

export interface Post {
  id: string
  content?: string
  media_type: MediaType
  media_url?: string
  is_announcement: boolean
  author: Author
  like_count: number
  comment_count: number
  is_liked: boolean
  created_at: string
  updated_at?: string
  comments?: Comment[]
}

export interface PostListResponse {
  posts: Post[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type NotificationType = 'announcement' | 'like' | 'comment' | 'message' | 'system'

export interface Notification {
  id: string
  title: string
  message: string
  notification_type: NotificationType
  is_read: boolean
  is_global: boolean
  reference_id?: string
  created_at: string
}

export interface NotificationListResponse {
  notifications: Notification[]
  total: number
  unread_count: number
  page: number
  page_size: number
}

export interface ChatUser {
  id: string
  full_name: string
  avatar_url?: string
}

export interface ChatMessage {
  id: string
  sender: ChatUser
  receiver: ChatUser
  message: string
  is_read: boolean
  created_at: string
}

export interface Conversation {
  user: ChatUser
  last_message?: ChatMessage
  unread_count: number
}

export interface ConversationListResponse {
  conversations: Conversation[]
}

export interface ChatHistoryResponse {
  messages: ChatMessage[]
  total: number
  page: number
  page_size: number
}

export interface Enquiry {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  is_resolved: boolean
  admin_notes?: string
  created_at: string
  resolved_at?: string
}

export interface EnquiryCreate {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export interface EnquiryListResponse {
  enquiries: Enquiry[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface Lesson {
  id: string
  title: string
  description: string
  text_content: string | null
  audio_url: string | null
  video_url: string | null
  duration_minutes: number | null
  order: number
  is_published: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface CreateLessonData {
  title: string
  description: string
  text_content?: string
  audio_url?: string
  video_url?: string
  duration_minutes?: number
  order?: number
  is_published?: boolean
}

export interface UpdateLessonData {
  title?: string
  description?: string
  text_content?: string
  audio_url?: string
  video_url?: string
  duration_minutes?: number
  order?: number
  is_published?: boolean
}

export interface LessonProgress {
  id: string
  lesson_id: string
  user_id: string
  completed: boolean
  last_position: number
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface AdminDashboardStats {
  total_students: number
  total_enquiries: number
  pending_enquiries: number
  resolved_enquiries: number
}

export interface UserListResponse {
  users: User[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface StudentInviteResponse {
  message: string
  user: User
}
