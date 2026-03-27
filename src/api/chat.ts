import api from './client'
import type { ConversationListResponse, ChatHistoryResponse, ChatMessage } from '@/types'

export const getConversations = async (): Promise<ConversationListResponse> => {
  const { data } = await api.get('/chat/conversations')
  return data
}

export const getChatHistory = async (
  userId: string,
  page = 1,
  pageSize = 50
): Promise<ChatHistoryResponse> => {
  const { data } = await api.get(`/chat/conversations/${userId}`, {
    params: { page, page_size: pageSize },
  })
  return data
}

export const sendMessage = async (receiverId: string, message: string): Promise<ChatMessage> => {
  const { data } = await api.post('/chat/messages', { receiver_id: receiverId, message })
  return data
}

export const markMessagesAsRead = async (userId: string): Promise<void> => {
  await api.put(`/chat/conversations/${userId}/read`)
}

export const getUnreadCount = async (): Promise<number> => {
  const { data } = await api.get('/chat/unread-count')
  return data.unread_count
}
