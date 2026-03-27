// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  SIGNUP: '/signup',
  LOGIN: '/login',
  REFRESH: '/refresh',
  LOGOUT: '/logout',
  
  // Prediction
  PREDICT: '/predict',
  HISTORY: '/history',
  BEHAVIOR: '/behavior',
  EXPLAIN: '/explain',
  
  // Player Analytics
  PLAYER_IMPACT: '/player-impact',
  PLAYER_BATTLE: '/player-battle',
  TEAM_SQUAD: '/team-squad',

  // Dashboard
  DASHBOARD_METRICS: '/dashboard-metrics',
  
  // Venue
  VENUE_INSIGHT: '/venue-insight',
}

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'cricket_ai_access_token',
  REFRESH_TOKEN: 'cricket_ai_refresh_token',
  USER_ID: 'cricket_ai_user_id',
  USER_EMAIL: 'cricket_ai_user_email',
}

// Query Keys for caching
export const QUERY_KEYS = {
  HISTORY: 'history',
  PLAYER_IMPACT: 'player-impact',
  PLAYER_BATTLE: 'player-battle',
  VENUE_INSIGHT: 'venue-insight',
  PREDICTION: 'prediction',
}

// IPL Teams
export const CRICKET_TEAMS = [
  'Chennai Super Kings',
  'Mumbai Indians',
  'Royal Challengers Bengaluru',
  'Kolkata Knight Riders',
  'Rajasthan Royals',
  'Sunrisers Hyderabad',
  'Delhi Capitals',
  'Punjab Kings',
  'Lucknow Super Giants',
  'Gujarat Titans',
]

// IPL Venues
export const POPULAR_VENUES = [
  'Wankhede Stadium',
  'Eden Gardens',
  'M. Chinnaswamy Stadium',
  'Narendra Modi Stadium',
  'MA Chidambaram Stadium',
  'Arun Jaitley Stadium',
  'Rajiv Gandhi International Stadium',
  'Sawai Mansingh Stadium',
  'Ekana Cricket Stadium',
  'Punjab Cricket Association Stadium',
]

// Popular Players (for autocomplete)
export const POPULAR_BATTERS = [
  'Virat Kohli',
  'Rohit Sharma',
  'Steve Smith',
  'Joe Root',
  'Kane Williamson',
  'Babar Azam',
  'David Warner',
  'Shubman Gill',
  'Travis Head',
  'Quinton de Kock',
]

export const POPULAR_BOWLERS = [
  'Jasprit Bumrah',
  'Pat Cummins',
  'Mitchell Starc',
  'Shaheen Afridi',
  'Rashid Khan',
  'Trent Boult',
  'Kagiso Rabada',
  'Mohammed Siraj',
  'Josh Hazlewood',
  'Mohammed Shami',
]

// Behavior tracking config
export const BEHAVIOR_CONFIG = {
  TRACK_INTERVAL: 1000, // ms
  MIN_TIME_TO_TRACK: 5000, // 5 seconds minimum
  IDLE_TIMEOUT: 30000, // 30 seconds
}

export { TEAM_LOGOS, getTeamLogo } from './teamLogos'
