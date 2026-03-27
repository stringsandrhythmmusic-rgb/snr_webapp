import api from './client'
import type { Post, PostListResponse } from '@/types'

export const getPosts = async (
  page = 1,
  pageSize = 20,
  announcementsOnly = false
): Promise<PostListResponse> => {
  const { data } = await api.get('/feeds', {
    params: { page, page_size: pageSize, announcements_only: announcementsOnly },
  })
  return data
}

export const getPost = async (postId: string): Promise<Post> => {
  const { data } = await api.get(`/feeds/${postId}`)
  return data
}

export const createPost = async (formData: FormData): Promise<Post> => {
  const { data } = await api.post('/feeds', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const updatePost = async (postId: string, content: string): Promise<Post> => {
  const { data } = await api.put(`/feeds/${postId}`, { content })
  return data
}

export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`/feeds/${postId}`)
}

export const likePost = async (postId: string): Promise<void> => {
  await api.post(`/feeds/${postId}/like`)
}

export const unlikePost = async (postId: string): Promise<void> => {
  await api.delete(`/feeds/${postId}/like`)
}

export const addComment = async (postId: string, content: string): Promise<Comment> => {
  const { data } = await api.post(`/feeds/${postId}/comments`, { content })
  return data
}

export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/feeds/comments/${commentId}`)
}
