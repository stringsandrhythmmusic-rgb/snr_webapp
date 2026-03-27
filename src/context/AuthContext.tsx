import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import * as authApi from '@/api/auth'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string, phone?: string) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('snr_auth_token')
    const savedUser = localStorage.getItem('snr_user_data')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      authApi.getCurrentUser()
        .then((freshUser) => {
          setUser(freshUser)
          localStorage.setItem('snr_user_data', JSON.stringify(freshUser))
        })
        .catch(() => {
          localStorage.removeItem('snr_auth_token')
          localStorage.removeItem('snr_user_data')
          setToken(null)
          setUser(null)
        })
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password)
    setToken(result.access_token)
    setUser(result.user)
    localStorage.setItem('snr_auth_token', result.access_token)
    localStorage.setItem('snr_user_data', JSON.stringify(result.user))
  }, [])

  const register = useCallback(async (email: string, password: string, fullName: string, phone?: string) => {
    const result = await authApi.register({ email, password, full_name: fullName, phone })
    setToken(result.access_token)
    setUser(result.user)
    localStorage.setItem('snr_auth_token', result.access_token)
    localStorage.setItem('snr_user_data', JSON.stringify(result.user))
  }, [])

  const logout = useCallback(() => {
    authApi.logout().catch(() => {})
    setToken(null)
    setUser(null)
    localStorage.removeItem('snr_auth_token')
    localStorage.removeItem('snr_user_data')
  }, [])

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('snr_user_data', JSON.stringify(updatedUser))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
