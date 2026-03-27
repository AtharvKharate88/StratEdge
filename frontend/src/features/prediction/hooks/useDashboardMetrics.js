import { useState, useEffect, useCallback, useRef } from 'react'
import { playerService } from '@/shared/services/api'

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const fetchMetrics = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await playerService.getDashboardMetrics()
      if (!mountedRef.current) return
      if (res.data?.success && res.data.data) {
        setMetrics(res.data.data)
      } else {
        setMetrics(null)
      }
    } catch (err) {
      if (!mountedRef.current) return
      setError(err.response?.data?.message || err.message || 'Failed to load metrics')
      setMetrics(null)
    } finally {
      if (mountedRef.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  return { metrics, isLoading, error, refresh: fetchMetrics }
}
