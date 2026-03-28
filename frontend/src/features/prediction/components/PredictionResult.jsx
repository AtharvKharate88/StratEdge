import Card, { CardHeader, CardTitle, CardContent } from '@/shared/components/Card.jsx'
import { WinProbabilityBar } from '@/shared/components/ProgressBar.jsx'
import Badge from '@/shared/components/Badge.jsx'
import Button from '@/shared/components/Button.jsx'
import { TrustScoreMeter } from './TrustScoreMeter.jsx'
import { TeamStatsComparison } from './TeamStatsComparison.jsx'
import { TopPlayersCard } from './TopPlayersCard.jsx'
import { PlayerBattleCard } from './PlayerBattleCard.jsx'
import { VenueInsightCard } from './VenueInsightCard.jsx'
import { getTeamLogo } from '@/shared/constants'
import { safeText } from '@/shared/utils'
import { Trophy, Sparkles, RefreshCw } from 'lucide-react'

export default function PredictionResult({ 
  prediction, 
  onExplain, 
  isExplaining,
  onReset 
}) {
  const { teamA, teamB, probability, trustScore, stats, topPlayers, playerBattle, venueInsight } = prediction

  // Get probabilities for each team
  const probA = probability?.[teamA] || 0.5
  const probB = probability?.[teamB] || 0.5

  // Determine winner
  const winner = probA > probB ? teamA : teamB
  const winProb = Math.max(probA, probB)
  const teamALabel = safeText(teamA, 'Team A')
  const teamBLabel = safeText(teamB, 'Team B')
  const winnerLabel = safeText(winner, 'Winner')
  const teamALogo = getTeamLogo(teamA)
  const teamBLogo = getTeamLogo(teamB)
  const winnerLogo = getTeamLogo(winner)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Prediction Card */}
      <Card glow className="relative rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse-glow">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Match Prediction</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      {teamALogo && <img src={teamALogo} alt={teamALabel} className="w-5 h-5 object-contain rounded-sm" />}
                      {teamALabel}
                    </span>
                    {' vs '}
                    <span className="inline-flex items-center gap-2">
                      {teamBLogo && <img src={teamBLogo} alt={teamBLabel} className="w-5 h-5 object-contain rounded-sm" />}
                      {teamBLabel}
                    </span>
                  </p>
                </div>
              </div>
              <Badge variant="primary">AI Generated</Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Winner Announcement */}
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-1">Predicted Winner</p>
              <h2 className="text-3xl font-bold text-foreground inline-flex items-center gap-3">
                {winnerLogo && <img src={winnerLogo} alt={winnerLabel} className="w-10 h-10 object-contain rounded-sm" />}
                {winnerLabel}
              </h2>
              <p className="text-lg text-primary font-medium">
                {(winProb * 100).toFixed(1)}% Win Probability
              </p>
            </div>

            {/* Win Probability Bar */}
            <WinProbabilityBar
              teamA={teamALabel}
              teamB={teamBLabel}
              probA={probA}
              probB={probB}
            />

            {/* Trust Score */}
            <TrustScoreMeter score={trustScore} />

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                onClick={onExplain}
                isLoading={isExplaining}
                className="flex-1"
              >
                <Sparkles className="w-4 h-4" />
                Explain with AI
              </Button>
              <Button variant="outline" onClick={onReset}>
                <RefreshCw className="w-4 h-4" />
                New Prediction
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Stats & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Stats */}
        {stats && (
          <TeamStatsComparison teamA={teamA} teamB={teamB} stats={stats} />
        )}

        {/* Top Players */}
        {topPlayers && topPlayers.length > 0 && (
          <TopPlayersCard players={topPlayers} />
        )}
      </div>

      {/* Optional Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Player Battle */}
        {playerBattle && (
          <PlayerBattleCard battle={playerBattle} />
        )}

        {/* Venue Insight */}
        {venueInsight && (
          <VenueInsightCard insight={venueInsight} />
        )}
      </div>
    </div>
  )
}
