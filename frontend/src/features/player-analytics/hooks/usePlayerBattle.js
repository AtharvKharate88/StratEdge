import { useState, useCallback, useRef, useEffect } from 'react'
import { playerService } from '@/shared/services/api'
import { useToast } from '@/shared/hooks/useToast'
import { debounce } from '@/shared/utils'

export function usePlayerBattle() {
  const [battle, setBattle] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const abortControllerRef = useRef(null)

  const fetchBattle = useCallback(async (batter, bowler) => {
    if (!batter || !bowler) {
      setBattle(null)
      return
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    setError(null)

    try {
      const response = await playerService.getBattle(batter, bowler)
      if (response.data.success) {
        setBattle(response.data.data)
      }
    } catch (err) {
      if (err.name !== 'CanceledError') {
        const message = err.response?.data?.message || 'Failed to load battle data'
        setError(message)
        toast({
          title: 'Error',
          description: message,
          variant: 'error',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Debounced version for search inputs
  const debouncedFetchBattle = useCallback(
    debounce((batter, bowler) => fetchBattle(batter, bowler), 500),
    [fetchBattle]
  )

  const reset = useCallback(() => {
    setBattle(null)
    setError(null)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    battle,
    isLoading,
    error,
    fetchBattle,
    debouncedFetchBattle,
    reset,
  }
}
