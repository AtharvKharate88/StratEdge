import { useState, useEffect, useCallback } from 'react'
import { predictionService } from '@/shared/services/api'
import { useToast } from '@/shared/hooks/useToast'

// Simple cache
let historyCache = null
let cacheTimestamp = 0
const CACHE_DURATION = 60000 // 1 minute

export function useHistory() {
  const [history, setHistory] = useState(historyCache?.data || [])
  const [count, setCount] = useState(historyCache?.count || 0)
  const [isLoading, setIsLoading] = useState(!historyCache)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  const fetchHistory = useCallback(async (forceRefresh = false) => {
    // Check cache
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
        const { data, count } = response.data
        historyCache = { data, count }
        cacheTimestamp = Date.now()
        setHistory(data)
        setCount(count)
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load history'
      setError(message)
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

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
