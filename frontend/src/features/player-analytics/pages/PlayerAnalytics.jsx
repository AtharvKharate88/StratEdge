import { useState } from 'react'
import { usePlayerImpact } from '../hooks/usePlayerImpact'
import { usePlayerBattle } from '../hooks/usePlayerBattle'
import Card, { CardHeader, CardTitle, CardContent } from '@/shared/components/Card.jsx'
import Button from '@/shared/components/Button.jsx'
import Select from '@/shared/components/Select.jsx'
import Badge from '@/shared/components/Badge.jsx'
import { SkeletonTable, SkeletonCard } from '@/shared/components/Skeleton.jsx'
import { PlayerBattleCard } from '@/features/prediction/components/PlayerBattleCard.jsx'
import { cn, getInitials } from '@/shared/utils'
import { POPULAR_BATTERS, POPULAR_BOWLERS } from '@/shared/constants'
import { Users, Star, TrendingUp, TrendingDown, Swords, RefreshCw } from 'lucide-react'

export default function PlayerAnalytics() {
  const { players, isLoading: impactLoading, refresh: refreshImpact } = usePlayerImpact(10)
  const { battle, isLoading: battleLoading, fetchBattle, reset: resetBattle } = usePlayerBattle()

  const datasetPlayerNames = players
    .map((player) => player?.player)
    .filter(Boolean)
  const batterOptions = Array.from(new Set([...datasetPlayerNames, ...POPULAR_BATTERS]))
  const bowlerOptions = Array.from(new Set([...datasetPlayerNames, ...POPULAR_BOWLERS]))
  
  const [selectedBatter, setSelectedBatter] = useState('')
  const [selectedBowler, setSelectedBowler] = useState('')

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Player Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Impact scores and head-to-head battles
          </p>
        </div>
        <Button variant="outline" onClick={refreshImpact} disabled={impactLoading}>
          <RefreshCw className={cn('w-4 h-4', impactLoading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Impact Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {impactLoading && <SkeletonTable rows={5} />}

            {!impactLoading && players.length > 0 && (
              <div className="space-y-3">
                {players.map((player, index) => (
                  <div
                    key={player.player || index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Rank */}
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                      index === 0 && 'bg-yellow-500/20 text-yellow-500',
                      index === 1 && 'bg-gray-400/20 text-gray-400',
                      index === 2 && 'bg-orange-600/20 text-orange-600',
                      index > 2 && 'bg-secondary text-muted-foreground'
                    )}>
                      {index + 1}
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {getInitials(player.player || 'Player')}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {player.player}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{player.matches || 0} matches</span>
                        <span>|</span>
                        <span>SR: {player.strikeRate?.toFixed(1) || '-'}</span>
                      </div>
                    </div>

                    {/* Impact & Form */}
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

        {/* Player Battle Lookup */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Swords className="w-5 h-5 text-accent" />
                Head-to-Head Battle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Batter
                  </label>
                  <Select
                    value={selectedBatter}
                    onChange={setSelectedBatter}
                    options={batterOptions}
                    placeholder="Select batter"
                    searchable
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bowler
                  </label>
                  <Select
                    value={selectedBowler}
                    onChange={setSelectedBowler}
                    options={bowlerOptions}
                    placeholder="Select bowler"
                    searchable
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleBattleSearch}
                  disabled={!selectedBatter || !selectedBowler || battleLoading}
                  isLoading={battleLoading}
                  className="flex-1"
                >
                  <Swords className="w-4 h-4" />
                  Compare
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Battle Result */}
          {battleLoading && <SkeletonCard />}
          
          {!battleLoading && battle && (
            <PlayerBattleCard battle={battle} />
          )}

          {!battleLoading && !battle && selectedBatter && selectedBowler && (
            <Card>
              <CardContent className="py-8 text-center">
                <Swords className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Click Compare to see the head-to-head stats
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
