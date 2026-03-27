import api from './client'
import type { Lesson, LessonProgress, CreateLessonData, UpdateLessonData } from '@/types'

export const getLessons = async (): Promise<{ lessons: Lesson[]; total: number }> => {
  const { data } = await api.get('/lessons')
  return data
}

export const getLesson = async (id: string): Promise<Lesson> => {
  const { data } = await api.get(`/lessons/${id}`)
  return data
}

export const createLesson = async (lessonData: CreateLessonData): Promise<Lesson> => {
  const { data } = await api.post('/lessons', lessonData)
  return data
}

export const updateLesson = async (id: string, lessonData: UpdateLessonData): Promise<Lesson> => {
  const { data } = await api.put(`/lessons/${id}`, lessonData)
  return data
}

export const deleteLesson = async (id: string): Promise<void> => {
  await api.delete(`/lessons/${id}`)
}

export const uploadAudio = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/lessons/upload/audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const uploadVideo = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await api.post('/lessons/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const getLessonProgress = async (lessonId: string): Promise<LessonProgress | null> => {
  try {
    const { data } = await api.get(`/lessons/${lessonId}/progress`)
    return data
  } catch {
    return null
  }
}

export const updateLessonProgress = async (
  lessonId: string,
  params: { last_position?: number; completed?: boolean }
): Promise<LessonProgress> => {
  const { data } = await api.post(`/lessons/${lessonId}/progress`, params)
  return data
}
