import api from './client'
import type { AuthToken, User, VerifyTokenResponse } from '@/types'

export const login = async (email: string, password: string): Promise<AuthToken> => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export const register = async (params: {
  email: string
  password: string
  full_name: string
  phone?: string
}): Promise<AuthToken> => {
  const { data } = await api.post('/auth/register', params)
  return data
}

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get('/auth/me')
  return data
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}

export const verifyToken = async (token: string): Promise<VerifyTokenResponse> => {
  const { data } = await api.get(`/auth/verify-token/${token}`)
  return data
}

export const setPassword = async (params: {
  token: string
  password: string
  confirm_password: string
}): Promise<AuthToken> => {
  const { data } = await api.post('/auth/set-password', params)
  return data
}
