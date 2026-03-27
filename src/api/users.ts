import api from './client'
import type { User, UserListResponse } from '@/types'

export const getProfile = async (): Promise<User> => {
  const { data } = await api.get('/users/profile')
  return data
}

export const updateProfile = async (params: {
  full_name?: string
  phone?: string
}): Promise<User> => {
  const { data } = await api.put('/users/profile', params)
  return data
}

export const uploadAvatar = async (file: File): Promise<User> => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const getUserById = async (userId: string): Promise<User> => {
  const { data } = await api.get(`/users/${userId}`)
  return data
}

export const getStudentDirectory = async (
  page = 1,
  pageSize = 20,
  search = ''
): Promise<UserListResponse> => {
  const { data } = await api.get('/users/directory', {
    params: { page, page_size: pageSize, search: search || undefined },
  })
  return data
}
