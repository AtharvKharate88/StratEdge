import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '@/shared/services/api'
import { STORAGE_KEYS } from '@/shared/constants'
import { clearHistoryCache } from '@/features/history/hooks/useHistory'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Restore auth state on mount
  useEffect(() => {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    const userId = localStorage.getItem(STORAGE_KEYS.USER_ID)
    const userEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL)

    if (accessToken) {
      setUser({
        id: userId || null,
        email: userEmail || null,
      })
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const response = await authService.login(email, password)
    const { accessToken, refreshToken, userId } = response.data
    
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId)
    localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email)

    clearHistoryCache()
    setUser({ id: userId, email })
    setIsAuthenticated(true)

    return response.data
  }, [])

  const signup = useCallback(async (email, password) => {
    const response = await authService.signup(email, password)
    return response.data
  }, [])

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearHistoryCache()
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_ID)
      localStorage.removeItem(STORAGE_KEYS.USER_EMAIL)
      setUser(null)
      setIsAuthenticated(false)
      window.location.href = '/login'
    }
  }, [])

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
