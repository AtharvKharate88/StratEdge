import { useState, useEffect, useCallback } from 'react'
import { playerService } from '@/shared/services/api'
import { useToast } from '@/shared/hooks/useToast'

// Cache
let impactCache = null
let cacheTimestamp = 0
const CACHE_DURATION = 300000 // 5 minutes

export function usePlayerImpact(top = 10) {
  const [players, setPlayers] = useState(impactCache?.data || [])
  const [count, setCount] = useState(impactCache?.count || 0)
  const [isLoading, setIsLoading] = useState(!impactCache)
  const [error, setError] = useState(null)
  const { toast } = useToast()

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
        const { data, count } = response.data
        impactCache = { data, count }
        cacheTimestamp = Date.now()
        setPlayers(data)
        setCount(count)
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load player impact data'
      setError(message)
      toast({
        title: 'Error',
        description: message,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }, [top, toast])

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
