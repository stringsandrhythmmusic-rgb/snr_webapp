import api from './client'
import type {
  AdminDashboardStats,
  UserListResponse,
  User,
  EnquiryListResponse,
  Enquiry,
  StudentInviteResponse,
} from '@/types'

export const getDashboardStats = async (): Promise<AdminDashboardStats> => {
  const { data } = await api.get('/admin/dashboard')
  return data
}

export const getStudents = async (
  page = 1,
  pageSize = 20,
  search = '',
  isActive?: boolean
): Promise<UserListResponse> => {
  const { data } = await api.get('/admin/students', {
    params: {
      page,
      page_size: pageSize,
      search: search || undefined,
      is_active: isActive,
    },
  })
  return data
}

export const getStudentDetails = async (studentId: string): Promise<User> => {
  const { data } = await api.get(`/admin/students/${studentId}`)
  return data
}

export const deactivateStudent = async (studentId: string): Promise<User> => {
  const { data } = await api.put(`/admin/students/${studentId}/deactivate`)
  return data
}

export const activateStudent = async (studentId: string): Promise<User> => {
  const { data } = await api.put(`/admin/students/${studentId}/activate`)
  return data
}

export const deleteStudent = async (studentId: string): Promise<void> => {
  await api.delete(`/admin/students/${studentId}`)
}

export const getEnquiries = async (
  page = 1,
  pageSize = 20,
  isResolved?: boolean
): Promise<EnquiryListResponse> => {
  const { data } = await api.get('/admin/enquiries', {
    params: { page, page_size: pageSize, is_resolved: isResolved },
  })
  return data
}

export const updateEnquiry = async (
  enquiryId: string,
  params: { is_resolved?: boolean; admin_notes?: string }
): Promise<Enquiry> => {
  const { data } = await api.put(`/admin/enquiries/${enquiryId}`, params)
  return data
}

export const createStudent = async (params: {
  email: string
  full_name: string
  phone?: string
}): Promise<StudentInviteResponse> => {
  const { data } = await api.post('/admin/students', params)
  return data
}
