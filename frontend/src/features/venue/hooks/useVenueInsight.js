import { useState, useCallback, useRef, useEffect } from 'react'
import { venueService } from '@/shared/services/api'
import { useToast } from '@/shared/hooks/useToast'
import { debounce } from '@/shared/utils'

// Cache for venue insights
const venueCache = new Map()

export function useVenueInsight() {
  const [insight, setInsight] = useState(null)
  const [availableVenues, setAvailableVenues] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const abortControllerRef = useRef(null)

  const fetchInsight = useCallback(async (venue) => {
    if (!venue) {
      setInsight(null)
      return
    }

    // Check cache
    if (venueCache.has(venue)) {
      setInsight(venueCache.get(venue))
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
      const response = await venueService.getInsight(venue)
      if (response.data.success) {
        const data = response.data.data
        venueCache.set(venue, data)
        setInsight(data)
      }
    } catch (err) {
      if (err.name !== 'CanceledError') {
        const status = err.response?.status
        const message = err.response?.data?.message || 'Failed to load venue data'
        
        if (status === 404) {
          const available = err.response?.data?.availableVenues || []
          setAvailableVenues(available)
        }
        
        setError(message)
        toast({
          title: 'Venue Error',
          description: message,
          variant: 'error',
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Debounced version for search
  const debouncedFetchInsight = useCallback(
    debounce((venue) => fetchInsight(venue), 500),
    [fetchInsight]
  )

  const reset = useCallback(() => {
    setInsight(null)
    setError(null)
    setAvailableVenues([])
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
    insight,
    availableVenues,
    isLoading,
    error,
    fetchInsight,
    debouncedFetchInsight,
    reset,
  }
}
