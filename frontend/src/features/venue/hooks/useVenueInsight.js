import { useState, useCallback, useRef, useEffect } from 'react'
import { venueService } from '@/shared/services/api'
import { useToast } from '@/shared/hooks/useToast'
import { isRequestAborted } from '@/shared/utils'

const venueCache = new Map()

export function useVenueInsight() {
  const [insight, setInsight] = useState(null)
  const [availableVenues, setAvailableVenues] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast
  const abortControllerRef = useRef(null)

  const fetchInsight = useCallback(async (venue) => {
    if (!venue) {
      setInsight(null)
      setIsLoading(false)
      return
    }

    if (venueCache.has(venue)) {
      setInsight(venueCache.get(venue))
      setError(null)
      setIsLoading(false)
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
      const response = await venueService.getInsight(venue, { signal })
      if (response.data.success) {
        const data = response.data.data
        venueCache.set(venue, data)
        setInsight(data)
      }
    } catch (err) {
      if (isRequestAborted(err)) return

      const status = err.response?.status
      const message = err.response?.data?.message || 'Failed to load venue data'

      if (status === 404) {
        const available = err.response?.data?.availableVenues || []
        setAvailableVenues(available)
      }

      setError(message)
      toastRef.current({
        title: 'Venue Error',
        description: message,
        variant: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setInsight(null)
    setError(null)
    setAvailableVenues([])
  }, [])

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    insight,
    availableVenues,
    isLoading,
    error,
    fetchInsight,
    reset,
  }
}
