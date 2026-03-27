import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/shared/constants'
import { isOfflineMode } from '@/shared/config/appMode'
import {
  mockAuthService,
  mockPredictionService,
  mockPlayerService,
  mockVenueService,
} from './mockApi'

// Auth Service
const realAuthService = {
  signup: (email, password) =>
    apiClient.post(API_ENDPOINTS.SIGNUP, { email, password }),

  login: (email, password) =>
    apiClient.post(API_ENDPOINTS.LOGIN, { email, password }),

  refresh: (refreshToken) =>
    apiClient.post(API_ENDPOINTS.REFRESH, { refreshToken }),

  logout: (refreshToken) =>
    apiClient.post(API_ENDPOINTS.LOGOUT, { refreshToken }),
}
export const authService = isOfflineMode ? mockAuthService : realAuthService

// Prediction Service
const realPredictionService = {
  predict: ({ teamA, teamB, venue, batter, bowler }) =>
    apiClient.post(API_ENDPOINTS.PREDICT, { teamA, teamB, venue, batter, bowler }),

  getHistory: () =>
    apiClient.get(API_ENDPOINTS.HISTORY),

  trackBehavior: ({ predictionId, timeSpent, clicks }) =>
    apiClient.post(API_ENDPOINTS.BEHAVIOR, { predictionId, timeSpent, clicks }),

  getExplanation: (predictionData) =>
    apiClient.post(API_ENDPOINTS.EXPLAIN, predictionData),
}
export const predictionService = isOfflineMode ? mockPredictionService : realPredictionService

// Player Analytics Service
const realPlayerService = {
  getImpactLeaderboard: (top = 10) =>
    apiClient.get(API_ENDPOINTS.PLAYER_IMPACT, { params: { top } }),

  getBattle: (batter, bowler) =>
    apiClient.get(API_ENDPOINTS.PLAYER_BATTLE, { params: { batter, bowler } }),
}
export const playerService = isOfflineMode ? mockPlayerService : realPlayerService

// Venue Service
const realVenueService = {
  getInsight: (venue) =>
    apiClient.get(API_ENDPOINTS.VENUE_INSIGHT, { params: { venue } }),
}
export const venueService = isOfflineMode ? mockVenueService : realVenueService
