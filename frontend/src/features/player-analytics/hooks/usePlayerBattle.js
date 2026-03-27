import { useState, useCallback, useRef, useEffect } from 'react'
import { playerService } from '@/shared/services/api'
import { useToast } from '@/shared/hooks/useToast'
import { isRequestAborted } from '@/shared/utils'

export function usePlayerBattle() {
  const [battle, setBattle] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast
  const abortControllerRef = useRef(null)

  const fetchBattle = useCallback(async (batter, bowler) => {
    if (!batter || !bowler) {
      setBattle(null)
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    setIsLoading(true)
    setError(null)

    try {
      const response = await playerService.getBattle(batter, bowler, { signal })
      if (response.data.success) {
        setBattle(response.data.data)
      }
    } catch (err) {
      if (isRequestAborted(err)) return

      const message = err.response?.data?.message || 'Failed to load battle data'
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

  const reset = useCallback(() => {
    setBattle(null)
    setError(null)
  }, [])

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
    reset,
  }
}
