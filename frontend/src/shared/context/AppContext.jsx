import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { playerService } from '@/shared/services/api'

const AppContext = createContext(null)

const PLAYER_TEAM_MAP = {
  'MS Dhoni': 'Chennai Super Kings',
  'Ruturaj Gaikwad': 'Chennai Super Kings',
  'R Jadeja': 'Chennai Super Kings',
  'Ravindra Jadeja': 'Chennai Super Kings',
  'Rohit Sharma': 'Mumbai Indians',
  'Jasprit Bumrah': 'Mumbai Indians',
  'Suryakumar Yadav': 'Mumbai Indians',
  'Hardik Pandya': 'Mumbai Indians',
  'Virat Kohli': 'Royal Challengers Bengaluru',
  'Mohammed Siraj': 'Royal Challengers Bengaluru',
  'Faf du Plessis': 'Royal Challengers Bengaluru',
  'Shreyas Iyer': 'Kolkata Knight Riders',
  'Andre Russell': 'Kolkata Knight Riders',
  'Sunil Narine': 'Kolkata Knight Riders',
  'Rinku Singh': 'Kolkata Knight Riders',
  'Sanju Samson': 'Rajasthan Royals',
  'Yashasvi Jaiswal': 'Rajasthan Royals',
  'Trent Boult': 'Rajasthan Royals',
  'Jos Buttler': 'Rajasthan Royals',
  'Pat Cummins': 'Sunrisers Hyderabad',
  'Travis Head': 'Sunrisers Hyderabad',
  'Heinrich Klaasen': 'Sunrisers Hyderabad',
  'Bhuvneshwar Kumar': 'Sunrisers Hyderabad',
  'Rishabh Pant': 'Delhi Capitals',
  'David Warner': 'Delhi Capitals',
  'Axar Patel': 'Delhi Capitals',
  'Kuldeep Yadav': 'Delhi Capitals',
  'Shikhar Dhawan': 'Punjab Kings',
  'Kagiso Rabada': 'Punjab Kings',
  'Arshdeep Singh': 'Punjab Kings',
  'Shubman Gill': 'Gujarat Titans',
  'Rashid Khan': 'Gujarat Titans',
  'Mohammed Shami': 'Gujarat Titans',
  'KL Rahul': 'Lucknow Super Giants',
  'Quinton de Kock': 'Lucknow Super Giants',
}

const inferTeam = (playerName, rawTeam) => {
  if (rawTeam && typeof rawTeam === 'string') return rawTeam
  return PLAYER_TEAM_MAP[playerName] || 'Unknown'
}

export function AppProvider({ children }) {
  const [selectedTeam, setSelectedTeamState] = useState('')
  const [selectedPlayer, setSelectedPlayerState] = useState('')
  const [players, setPlayers] = useState([])
  const [isPlayersLoading, setIsPlayersLoading] = useState(true)
  const [playersError, setPlayersError] = useState(null)

  const setSelectedTeam = useCallback((teamName) => {
    setSelectedTeamState((previous) => {
      if (previous !== teamName) {
        setSelectedPlayerState('')
      }
      return teamName
    })
  }, [])

  const setSelectedPlayer = useCallback((playerName) => {
    setSelectedPlayerState(playerName || '')
  }, [])

  useEffect(() => {
    let isMounted = true

    async function fetchPlayers() {
      setIsPlayersLoading(true)
      setPlayersError(null)

      try {
        const response = await playerService.getImpactLeaderboard(300)
        if (!isMounted) return

        const apiPlayers = Array.isArray(response?.data?.data) ? response.data.data : []
        const normalized = apiPlayers.map((player) => ({
          ...player,
          name: player.player,
          team: inferTeam(player.player, player.team),
        }))
        setPlayers(normalized)
      } catch (error) {
        if (!isMounted) return
        setPlayersError(error.userMessage || error.response?.data?.message || 'Failed to load players')
        setPlayers([])
      } finally {
        if (isMounted) {
          setIsPlayersLoading(false)
        }
      }
    }

    fetchPlayers()
    return () => {
      isMounted = false
    }
  }, [])

  const filteredPlayers = useMemo(() => {
    if (!selectedTeam) return []
    return players.filter((player) => player.team === selectedTeam)
  }, [players, selectedTeam])

  const value = {
    selectedTeam,
    selectedPlayer,
    setSelectedTeam,
    setSelectedPlayer,
    players,
    filteredPlayers,
    isPlayersLoading,
    playersError,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
