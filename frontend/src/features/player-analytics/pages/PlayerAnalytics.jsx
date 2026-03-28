import { useState, useEffect } from 'react'
import { usePlayerImpact } from '../hooks/usePlayerImpact'
import { usePlayerBattle } from '../hooks/usePlayerBattle'
import { useTeamSquad } from '@/features/prediction/hooks/useTeamSquad'
import Card, { CardHeader, CardTitle, CardContent } from '@/shared/components/Card.jsx'
import Button from '@/shared/components/Button.jsx'
import Select from '@/shared/components/Select.jsx'
import { SkeletonTable, SkeletonCard } from '@/shared/components/Skeleton.jsx'
import { PlayerBattleCard } from '@/features/prediction/components/PlayerBattleCard.jsx'
import { cn, getInitials, isValidPlayerLabel } from '@/shared/utils'
import { CRICKET_TEAMS, getTeamLogo } from '@/shared/constants'
import { Star, TrendingUp, TrendingDown, Swords, RefreshCw, Users } from 'lucide-react'

export default function PlayerAnalytics() {
  const { players, isLoading: impactLoading, refresh: refreshImpact } = usePlayerImpact(200)
  const { battle, isLoading: battleLoading, fetchBattle, reset: resetBattle } = usePlayerBattle()

  const [battleTeamA, setBattleTeamA] = useState('')
  const [battleTeamB, setBattleTeamB] = useState('')
  const [selectedBatter, setSelectedBatter] = useState('')
  const [selectedBowler, setSelectedBowler] = useState('')

  const {
    players: batterOptions,
    isLoading: squadALoading,
    season: batterSeason,
  } = useTeamSquad(battleTeamA, 'batter')
  const {
    players: bowlerOptions,
    isLoading: squadBLoading,
    season: bowlerSeason,
  } = useTeamSquad(battleTeamB, 'bowler')

  const teamsReady =
    Boolean(battleTeamA && battleTeamB && battleTeamA !== battleTeamB)

  useEffect(() => {
    setSelectedBatter('')
  }, [battleTeamA])

  useEffect(() => {
    setSelectedBowler('')
  }, [battleTeamB])

  const impactRows = players.filter((p) => isValidPlayerLabel(p?.player))

  const teamOptions = CRICKET_TEAMS.map((team) => ({
    value: team,
    label: team,
    icon: getTeamLogo(team),
  }))
  const teamsForB = teamOptions.filter((t) => t.value !== battleTeamA)
  const teamsForA = teamOptions.filter((t) => t.value !== battleTeamB)

  const handleBattleSearch = () => {
    if (selectedBatter && selectedBowler) {
      fetchBattle(selectedBatter, selectedBowler)
    }
  }

  const handleReset = () => {
    setSelectedBatter('')
    setSelectedBowler('')
    resetBattle()
  }

  const handleResetAll = () => {
    setBattleTeamA('')
    setBattleTeamB('')
    setSelectedBatter('')
    setSelectedBowler('')
    resetBattle()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Player analytics</h1>
          <p className="text-muted-foreground mt-1 max-w-xl text-sm">
            Player impact ranks and a head-to-head comparison.
          </p>
        </div>
        <Button variant="outline" onClick={refreshImpact} disabled={impactLoading}>
          <RefreshCw className={cn('w-4 h-4', impactLoading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Impact Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {impactLoading && <SkeletonTable rows={5} />}

            {!impactLoading && impactRows.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No data yet. Try Refresh.</p>
            )}

            {!impactLoading && impactRows.length > 0 && (
              <div className="space-y-3">
                {impactRows.map((player, index) => (
                  <div
                    key={player.player || index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                        index === 0 && 'bg-yellow-500/20 text-yellow-500',
                        index === 1 && 'bg-gray-400/20 text-gray-400',
                        index === 2 && 'bg-orange-600/20 text-orange-600',
                        index > 2 && 'bg-secondary text-muted-foreground'
                      )}
                    >
                      {index + 1}
                    </div>

                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {getInitials(player.player || 'Player')}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground break-words">{player.player}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{player.matches || 0} matches</span>
                        <span>|</span>
                        <span>SR: {player.strikeRate?.toFixed(1) || '-'}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-bold text-primary">
                        {player.impactScore?.toFixed(1) || '-'}
                      </div>
                      <div className="flex items-center gap-1 text-xs justify-end">
                        {player.formFactor > 1 ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-green-500">Form</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 text-destructive" />
                            <span className="text-destructive">Form</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-accent" />
                Head-to-Head Battle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Teams
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">Batter&apos;s team</label>
                    <Select
                      value={battleTeamA}
                      onChange={setBattleTeamA}
                      options={teamsForA}
                      placeholder="Select team (batters)"
                      searchable
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">Bowler&apos;s team</label>
                    <Select
                      value={battleTeamB}
                      onChange={setBattleTeamB}
                      options={teamsForB}
                      placeholder="Select team (bowlers)"
                      searchable
                    />
                  </div>
                </div>
                {battleTeamA && battleTeamB && battleTeamA === battleTeamB && (
                  <p className="text-xs text-destructive mt-2">Choose two different teams.</p>
                )}
              </div>

              {!teamsReady ? (
                <p className="text-sm text-muted-foreground border border-dashed border-border rounded-lg p-4">
                  Pick two different teams, then choose players.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Batter ({battleTeamA})
                      {batterSeason?.matchCount != null && (
                        <span className="text-xs font-normal text-muted-foreground">
                          {' '}
                          · {batterSeason.matchCount} matches
                          {batterSeason?.usedFallback ? ' · all-time fallback' : ''}
                        </span>
                      )}
                    </label>
                    <Select
                      value={selectedBatter}
                      onChange={setSelectedBatter}
                      options={batterOptions}
                      placeholder={
                        squadALoading
                          ? 'Loading batters…'
                          : batterOptions.length
                            ? 'Select batter'
                            : 'No batters for this team'
                      }
                      searchable
                      disabled={squadALoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Bowler ({battleTeamB})
                      {bowlerSeason?.matchCount != null && (
                        <span className="text-xs font-normal text-muted-foreground">
                          {' '}
                          · {bowlerSeason.matchCount} matches
                          {bowlerSeason?.usedFallback ? ' · all-time fallback' : ''}
                        </span>
                      )}
                    </label>
                    <Select
                      value={selectedBowler}
                      onChange={setSelectedBowler}
                      options={bowlerOptions}
                      placeholder={
                        squadBLoading
                          ? 'Loading bowlers…'
                          : bowlerOptions.length
                            ? 'Select bowler'
                            : 'No bowlers for this team'
                      }
                      searchable
                      disabled={squadBLoading}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleBattleSearch}
                  disabled={
                    !teamsReady ||
                    !selectedBatter ||
                    !selectedBowler ||
                    battleLoading ||
                    squadALoading ||
                    squadBLoading
                  }
                  isLoading={battleLoading}
                  className="flex-1"
                >
                  <Swords className="w-4 h-4" />
                  Compare
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Clear players
                </Button>
                <Button variant="outline" onClick={handleResetAll}>
                  Reset all
                </Button>
              </div>
            </CardContent>
          </Card>

          {battleLoading && <SkeletonCard />}

          {!battleLoading && battle && <PlayerBattleCard battle={battle} />}

          {!battleLoading && !battle && selectedBatter && selectedBowler && (
            <Card>
              <CardContent className="py-8 text-center">
                <Swords className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Click Compare to see the head-to-head stats</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
