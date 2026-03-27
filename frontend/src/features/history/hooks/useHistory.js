import { useState, useEffect, useCallback, useRef } from 'react'
import { predictionService } from '@/shared/services/api'
import { useToast } from '@/shared/hooks/useToast'

let historyCache = null
let cacheTimestamp = 0
const CACHE_DURATION = 60000

export function useHistory() {
  const [history, setHistory] = useState(historyCache?.data || [])
  const [count, setCount] = useState(historyCache?.count || 0)
  const [isLoading, setIsLoading] = useState(!historyCache)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const fetchHistory = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && historyCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setHistory(historyCache.data)
      setCount(historyCache.count)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await predictionService.getHistory()
      if (response.data.success) {
        const { data, count: c } = response.data
        historyCache = { data, count: c }
        cacheTimestamp = Date.now()
        setHistory(data)
        setCount(c)
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load history'
      setError(message)
      toastRef.current({
        title: 'Error',
        description: message,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const refresh = useCallback(() => fetchHistory(true), [fetchHistory])

  return {
    history,
    count,
    isLoading,
    error,
    refresh,
  }
}
