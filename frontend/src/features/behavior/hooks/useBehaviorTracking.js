import { useState, useCallback, useRef, useEffect } from 'react'
import { predictionService } from '@/shared/services/api'
import { BEHAVIOR_CONFIG } from '@/shared/constants'

export function useBehaviorTracking() {
  const [predictionId, setPredictionId] = useState(null)
  const [clicks, setClicks] = useState(0)
  const clicksRef = useRef(0)
  const startTimeRef = useRef(null)
  const isTrackingRef = useRef(false)
  const sentRef = useRef(false)

  const startTracking = useCallback((id) => {
    if (!id) return
    
    setPredictionId(id)
    setClicks(0)
    clicksRef.current = 0
    startTimeRef.current = Date.now()
    isTrackingRef.current = true
    sentRef.current = false
  }, [])

  const trackClick = useCallback(() => {
    if (isTrackingRef.current) {
      clicksRef.current += 1
      setClicks((prev) => prev + 1)
    }
  }, [])

  const sendBehavior = useCallback(async () => {
    // Prevent duplicate sends
    if (!predictionId || !isTrackingRef.current || sentRef.current) return
    
    const timeSpent = startTimeRef.current 
      ? Math.round((Date.now() - startTimeRef.current) / 1000) 
      : 0

    // Only send if user spent enough time
    if (timeSpent < BEHAVIOR_CONFIG.MIN_TIME_TO_TRACK / 1000) return

    sentRef.current = true

    try {
      // Send silently in background - don't await or block UI
      predictionService.trackBehavior({
        predictionId,
        timeSpent,
        clicks: clicksRef.current,
      }).catch(() => {
        // Silently fail - behavior tracking should not affect UX
      })
    } catch (error) {
      // Silently fail
    }
  }, [predictionId])

  const stopTracking = useCallback(() => {
    if (isTrackingRef.current && !sentRef.current) {
      sendBehavior()
    }
    isTrackingRef.current = false
    setPredictionId(null)
    setClicks(0)
    clicksRef.current = 0
    startTimeRef.current = null
  }, [sendBehavior])

  // Send behavior on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isTrackingRef.current && !sentRef.current) {
        sendBehavior()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [sendBehavior])

  // Send behavior on visibility change (tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isTrackingRef.current && !sentRef.current) {
        sendBehavior()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [sendBehavior])

  // Idle timeout
  useEffect(() => {
    if (!isTrackingRef.current) return

    const idleTimeout = setTimeout(() => {
      if (isTrackingRef.current && !sentRef.current) {
        sendBehavior()
      }
    }, BEHAVIOR_CONFIG.IDLE_TIMEOUT)

    return () => clearTimeout(idleTimeout)
  }, [predictionId, sendBehavior])

  return {
    startTracking,
    stopTracking,
    trackClick,
    predictionId,
    clicks,
  }
}
