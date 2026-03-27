import axios from 'axios'
import { STORAGE_KEYS } from '@/shared/constants'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000/api'

const AUTH_FREE_PATHS = ['/login', '/signup']

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const serverMessage = error.response?.data?.message
    const isNetworkError = !error.response

    error.userMessage =
      serverMessage ||
      (isNetworkError ? 'Unable to reach server. Please try again.' : 'Request failed.')

    if (status === 401 && !AUTH_FREE_PATHS.includes(window.location.pathname)) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_ID)
      localStorage.removeItem(STORAGE_KEYS.USER_EMAIL)
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default apiClient
