import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants'

// Auth Service
export const authService = {
  signup: (email, password) =>
    apiClient.post(API_ENDPOINTS.SIGNUP, { email, password }),

  login: (email, password) =>
    apiClient.post(API_ENDPOINTS.LOGIN, { email, password }),

  refresh: (refreshToken) =>
    apiClient.post(API_ENDPOINTS.REFRESH, { refreshToken }),

  logout: (refreshToken) =>
    apiClient.post(API_ENDPOINTS.LOGOUT, { refreshToken }),
}

// Prediction Service
export const predictionService = {
  predict: ({ teamA, teamB, venue, batter, bowler }) =>
    apiClient.post(API_ENDPOINTS.PREDICT, { teamA, teamB, venue, batter, bowler }),

  getHistory: () =>
    apiClient.get(API_ENDPOINTS.HISTORY),

  trackBehavior: ({ predictionId, timeSpent, clicks }) =>
    apiClient.post(API_ENDPOINTS.BEHAVIOR, { predictionId, timeSpent, clicks }),

  getExplanation: (predictionData, config = {}) =>
    apiClient.post(API_ENDPOINTS.EXPLAIN, predictionData, config),
}

// Player Analytics Service
export const playerService = {
  getImpactLeaderboard: (top = 10) =>
    apiClient.get(API_ENDPOINTS.PLAYER_IMPACT, { params: { top } }),

  getBattle: (batter, bowler, config = {}) =>
    apiClient.get(API_ENDPOINTS.PLAYER_BATTLE, { params: { batter, bowler }, ...config }),

  getTeamSquad: (team, role) =>
    apiClient.get(API_ENDPOINTS.TEAM_SQUAD, { params: { team, role } }),

  getDashboardMetrics: () =>
    apiClient.get(API_ENDPOINTS.DASHBOARD_METRICS),
}

// Venue Service
export const venueService = {
  getInsight: (venue, config = {}) =>
    apiClient.get(API_ENDPOINTS.VENUE_INSIGHT, { params: { venue }, ...config }),
}
