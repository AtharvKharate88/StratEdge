import { useState, useEffect } from 'react'
import { playerService } from '@/shared/services/api'

function sanitizeNames(list) {
  if (!Array.isArray(list)) return []
  return list.filter((n) => {
    if (n == null) return false
    const s = String(n).trim()
    return s.length > 0 && s.toLowerCase() !== 'undefined' && s.toUpperCase() !== 'NA'
  })
}

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
          setPlayers(sanitizeNames(payload.players))
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
