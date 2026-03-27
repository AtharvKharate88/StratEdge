import { useState, useEffect, useCallback, useRef } from 'react'
import { playerService } from '@/shared/services/api'
import { useToast } from '@/shared/hooks/useToast'

let impactCache = null
let cacheTimestamp = 0
const CACHE_DURATION = 300000

export function usePlayerImpact(top = 10) {
  const [players, setPlayers] = useState(impactCache?.data || [])
  const [count, setCount] = useState(impactCache?.count || 0)
  const [isLoading, setIsLoading] = useState(!impactCache)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const fetchImpact = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && impactCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      setPlayers(impactCache.data)
      setCount(impactCache.count)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await playerService.getImpactLeaderboard(top)
      if (response.data.success) {
        const { data, count: c } = response.data
        impactCache = { data, count: c }
        cacheTimestamp = Date.now()
        setPlayers(data)
        setCount(c)
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load player impact data'
      setError(message)
      toastRef.current({
        title: 'Error',
        description: message,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }, [top])

  useEffect(() => {
    fetchImpact()
  }, [fetchImpact])

  const refresh = useCallback(() => fetchImpact(true), [fetchImpact])

  return {
    players,
    count,
    isLoading,
    error,
    refresh,
  }
}
