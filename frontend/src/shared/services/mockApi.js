import { POPULAR_VENUES } from '@/shared/constants'

const DEMO_ACCESS_TOKEN = 'demo-access-token'
const DEMO_REFRESH_TOKEN = 'demo-refresh-token'
const DEMO_USER_ID = 'demo-user'
const DEFAULT_DELAY = 250

const wait = (ms = DEFAULT_DELAY) => new Promise((resolve) => setTimeout(resolve, ms))

const buildProbability = (teamA, teamB) => {
  const seed = (teamA.length * 7 + teamB.length * 13) % 100
  const probA = Math.min(0.78, Math.max(0.42, 0.4 + seed / 500))
  const probB = Number((1 - probA).toFixed(2))
  return {
    [teamA]: Number(probA.toFixed(2)),
    [teamB]: probB,
  }
}

const buildPlayerBattle = (batter = 'Virat Kohli', bowler = 'Jasprit Bumrah') => ({
  batter,
  bowler,
  runs: 72,
  balls: 54,
  dismissals: 2,
  strikeRate: 133.3,
  dataStatus: 'Sufficient data',
  dominanceTag: 'Balanced',
})

const buildVenueInsight = (venue = POPULAR_VENUES[0]) => ({
  venue,
  type: venue.includes('Chinnaswamy') ? 'Batting Friendly' : 'Balanced',
  avgRuns: venue.includes('Dubai') ? 161 : 176,
  matches: venue.includes('Lords') ? 49 : 68,
})

const buildPredictionData = ({ teamA, teamB, venue, batter, bowler }) => ({
  teamA,
  teamB,
  probability: buildProbability(teamA, teamB),
  trustScore: 0.78,
  stats: {
    [teamA]: { recentForm: 74, battingStrength: 82, bowlingStrength: 77 },
    [teamB]: { recentForm: 69, battingStrength: 79, bowlingStrength: 80 },
  },
  topPlayers: [
    { player: batter || 'Virat Kohli', impactScore: 8.7, role: 'Batter' },
    { player: bowler || 'Jasprit Bumrah', impactScore: 8.4, role: 'Bowler' },
    { player: 'Rohit Sharma', impactScore: 7.8, role: 'Batter' },
  ],
  playerBattle: buildPlayerBattle(batter, bowler),
  venueInsight: buildVenueInsight(venue),
})

const historyItems = [
  {
    id: 'hist-1',
    teamA: 'India',
    teamB: 'Australia',
    probability: { India: 0.58, Australia: 0.42 },
    trustScore: 0.81,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'hist-2',
    teamA: 'England',
    teamB: 'Pakistan',
    probability: { England: 0.49, Pakistan: 0.51 },
    trustScore: 0.69,
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockAuthService = {
  signup: async () => {
    await wait()
    return { data: { success: true, message: 'Demo signup successful' } }
  },

  login: async (email) => {
    await wait()
    return {
      data: {
        success: true,
        accessToken: DEMO_ACCESS_TOKEN,
        refreshToken: DEMO_REFRESH_TOKEN,
        userId: DEMO_USER_ID,
        email,
      },
    }
  },

  refresh: async () => {
    await wait(120)
    return {
      data: {
        success: true,
        accessToken: DEMO_ACCESS_TOKEN,
      },
    }
  },

  logout: async () => {
    await wait(120)
    return { data: { success: true } }
  },
}

export const mockPredictionService = {
  predict: async ({ teamA, teamB, venue, batter, bowler }) => {
    await wait(350)
    return {
      data: {
        success: true,
        predictionId: `pred-${Date.now()}`,
        data: buildPredictionData({ teamA, teamB, venue, batter, bowler }),
      },
    }
  },

  getHistory: async () => {
    await wait()
    return {
      data: {
        success: true,
        data: historyItems,
        count: historyItems.length,
      },
    }
  },

  trackBehavior: async () => {
    await wait(100)
    return { data: { success: true } }
  },

  getExplanation: async ({ teamA, teamB, trustScore }) => {
    await wait(300)
    return {
      data: {
        success: true,
        explanation: `${teamA} has a slight edge over ${teamB} based on recent form and batting depth. The trust score of ${(trustScore * 100).toFixed(0)}% indicates moderate-to-high model confidence. In this demo mode, these insights are generated from mock data so you can browse all screens without a backend.`,
      },
    }
  },
}

export const mockPlayerService = {
  getImpactLeaderboard: async (top = 10) => {
    await wait()
    const data = [
      { player: 'Virat Kohli', impactScore: 9.1, formFactor: 1.2, matches: 24, strikeRate: 142.3 },
      { player: 'Jasprit Bumrah', impactScore: 8.8, formFactor: 1.1, matches: 22, strikeRate: 85.1 },
      { player: 'Rohit Sharma', impactScore: 8.4, formFactor: 1.05, matches: 23, strikeRate: 146.9 },
      { player: 'Travis Head', impactScore: 8.2, formFactor: 0.98, matches: 21, strikeRate: 151.2 },
      { player: 'Kane Williamson', impactScore: 7.9, formFactor: 1.03, matches: 19, strikeRate: 131.7 },
    ].slice(0, top)

    return { data: { success: true, data, count: data.length } }
  },

  getBattle: async (batter, bowler) => {
    await wait()
    return { data: { success: true, data: buildPlayerBattle(batter, bowler) } }
  },
}

export const mockVenueService = {
  getInsight: async (venue) => {
    await wait()
    return {
      data: {
        success: true,
        data: buildVenueInsight(venue),
      },
    }
  },
}
