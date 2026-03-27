import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://snr-service-2.onrender.com'
const API_PREFIX = '/api'

export const BASE_URL = API_BASE_URL
export const FULL_URL = `${API_BASE_URL}${API_PREFIX}`
export const WS_URL = import.meta.env.VITE_WS_URL || 'wss://snr-service-2.onrender.com/ws/chat'

const api = axios.create({
  baseURL: FULL_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('snr_auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('snr_auth_token')
      localStorage.removeItem('snr_user_data')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
