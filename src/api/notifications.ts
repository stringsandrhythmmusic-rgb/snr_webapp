import api from './client'
import type { NotificationListResponse, Notification } from '@/types'

export const getNotifications = async (
  page = 1,
  pageSize = 20,
  unreadOnly = false
): Promise<NotificationListResponse> => {
  const { data } = await api.get('/notifications', {
    params: { page, page_size: pageSize, unread_only: unreadOnly },
  })
  return data
}

export const markAsRead = async (notificationId: string): Promise<Notification> => {
  const { data } = await api.put(`/notifications/${notificationId}/read`)
  return data
}

export const markAllAsRead = async (): Promise<void> => {
  await api.put('/notifications/read-all')
}

export const createAnnouncement = async (title: string, message: string): Promise<Notification> => {
  const { data } = await api.post('/notifications/announcements', { title, message })
  return data
}
