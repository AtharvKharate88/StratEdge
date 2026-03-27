import { useState, useEffect } from 'react'
import { playerService } from '@/shared/services/api'

/**
 * Playing-XI–style lists for the current season window (latest ~20% of matches), from the backend.
 */
export function useTeamSquad(team, role) {
  const [players, setPlayers] = useState([])
  const [season, setSeason] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!team) {
      setPlayers([])
      setSeason(null)
      return
    }

    let cancelled = false
    setIsLoading(true)

    playerService
      .getTeamSquad(team, role)
      .then((res) => {
        if (cancelled) return
        const payload = res.data?.data
        if (res.data?.success && payload) {
          setPlayers(Array.isArray(payload.players) ? payload.players : [])
          setSeason(payload.season ?? null)
        } else {
          setPlayers([])
          setSeason(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPlayers([])
          setSeason(null)
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [team, role])

  return { players, season, isLoading }
}
