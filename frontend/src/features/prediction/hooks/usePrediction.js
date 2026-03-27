import { useState, useCallback, useRef } from 'react'
import { predictionService } from '@/shared/services/api'
import { playerService } from '@/shared/services/api'
import { useToast } from '@/shared/hooks/useToast'

function normalizePercentLike(value, fallback = 0) {
  const num = Number(value)
  if (!Number.isFinite(num)) return fallback
  if (num > 1) return Math.min(Math.max(num / 100, 0), 1)
  return Math.min(Math.max(num, 0), 1)
}

function normalizeProbability(probability = {}, teamA, teamB) {
  const rawA = probability?.[teamA]
  const rawB = probability?.[teamB]

  let probA = normalizePercentLike(rawA, NaN)
  let probB = normalizePercentLike(rawB, NaN)

  if (!Number.isFinite(probA) && Number.isFinite(probB)) probA = 1 - probB
  if (!Number.isFinite(probB) && Number.isFinite(probA)) probB = 1 - probA
  if (!Number.isFinite(probA) || !Number.isFinite(probB)) {
    probA = 0.5
    probB = 0.5
  }

  const sum = probA + probB
  if (sum > 0) {
    probA /= sum
    probB /= sum
  }

  return {
    [teamA]: Number(probA.toFixed(4)),
    [teamB]: Number(probB.toFixed(4)),
  }
}

function normalizeTeamStats(stats = {}, teamA, teamB) {
  const normalizeOne = (teamStats = {}) => ({
    ...teamStats,
    winRate: normalizePercentLike(teamStats.winRate, 0),
    avgScore: Number(teamStats.avgScore ?? teamStats.avgRuns ?? 0),
    avgRuns: Number(teamStats.avgRuns ?? teamStats.avgScore ?? 0),
    recentForm: Number(teamStats.recentForm ?? 0),
    h2hWins: Number(teamStats.h2hWins ?? 0),
  })

  return {
    [teamA]: normalizeOne(stats?.[teamA]),
    [teamB]: normalizeOne(stats?.[teamB]),
  }
}

function normalizePredictionPayload(payload = {}) {
  const teamA = payload.teamA
  const teamB = payload.teamB

  if (!teamA || !teamB) return payload

  return {
    ...payload,
    probability: normalizeProbability(payload.probability, teamA, teamB),
    trustScore: normalizePercentLike(payload.trustScore, 0),
    stats: normalizeTeamStats(payload.stats, teamA, teamB),
    topPlayers: Array.isArray(payload.topPlayers) ? payload.topPlayers : [],
  }
}

export function usePrediction() {
  const [prediction, setPrediction] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const toastRef = useRef(toast)
  toastRef.current = toast

  const predict = useCallback(async (params) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await predictionService.predict(params)
      if (response.data.success) {
        const predictionPayload = { ...response.data.data }

        // Fallback: fetch battle from dedicated endpoint when /predict omits it.
        if (!predictionPayload.playerBattle && params?.batter && params?.bowler) {
          try {
            const battleResponse = await playerService.getBattle(params.batter, params.bowler)
            if (battleResponse?.data?.success) {
              predictionPayload.playerBattle = battleResponse.data.data
            }
          } catch (battleError) {
            // Keep prediction successful even if optional battle fetch fails.
          }
        }

        const normalizedPrediction = normalizePredictionPayload(predictionPayload)
        setPrediction({
          id: response.data.predictionId,
          ...normalizedPrediction,
        })
        return response.data
      } else {
        throw new Error('Prediction failed')
      }
    } catch (err) {
      const message = err.userMessage || err.response?.data?.message || 'Failed to get prediction'
      setError(message)
      toastRef.current({
        title: 'Prediction Error',
        description: message,
        variant: 'error',
      })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setPrediction(null)
    setError(null)
  }, [])

  return {
    prediction,
    isLoading,
    error,
    predict,
    reset,
  }
}
