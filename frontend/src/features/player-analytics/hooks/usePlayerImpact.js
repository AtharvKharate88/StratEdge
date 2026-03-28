import { useState, useEffect, useCallback, useRef } from 'react'
import { playerService } from '@/shared/services/api'
import { useToast } from '@/shared/hooks/useToast'

/** Bump when server fixes player/impact payloads so clients do not reuse stale empty lists. */
const IMPACT_CACHE_VERSION = 3
const CACHE_DURATION = 300000
let impactCache = {
  top: null,
  data: null,
  count: 0,
  ts: 0,
  v: IMPACT_CACHE_VERSION,
}

export function usePlayerImpact(top = 10) {
  const cacheOk =
    impactCache.v === IMPACT_CACHE_VERSION &&
    impactCache.top === top &&
    Array.isArray(impactCache.data)

  const [players, setPlayers] = useState(cacheOk ? impactCache.data : [])
  const [count, setCount] = useState(cacheOk ? impactCache.count || 0 : 0)
  const [isLoading, setIsLoading] = useState(!cacheOk)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const fetchImpact = useCallback(async (forceRefresh = false) => {
    if (
      !forceRefresh &&
      impactCache.v === IMPACT_CACHE_VERSION &&
      impactCache.top === top &&
      impactCache.data &&
      Date.now() - impactCache.ts < CACHE_DURATION
    ) {
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
        const raw = response.data.data
        const data = Array.isArray(raw)
          ? raw.filter((row) => {
              if (!row?.player) return false
              const s = String(row.player).trim()
              return s.length > 0 && s.toLowerCase() !== 'undefined' && s.toUpperCase() !== 'NA'
            })
          : []
        const c = response.data.count ?? data.length
        impactCache = { top, data, count: c, ts: Date.now(), v: IMPACT_CACHE_VERSION }
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
