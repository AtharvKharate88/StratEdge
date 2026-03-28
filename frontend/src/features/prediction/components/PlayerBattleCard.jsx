import Card, { CardHeader, CardTitle, CardContent } from '@/shared/components/Card.jsx'
import Badge from '@/shared/components/Badge.jsx'
import { cn, getInitials, safeText } from '@/shared/utils'
import { Swords } from 'lucide-react'

export function PlayerBattleCard({ battle }) {
  if (!battle) return null

  const { batter, bowler, runs, balls, dismissals, strikeRate, dataStatus, dominanceTag } = battle
  const batterLabel = safeText(batter, 'Batter')
  const bowlerLabel = safeText(bowler, 'Bowler')

  const getBadgeVariant = () => {
    if (dominanceTag === 'Batter Dominates') return 'success'
    if (dominanceTag === 'Bowler Dominates') return 'danger'
    return 'info'
  }

  const isLowData = dataStatus?.includes('Not enough data')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-primary" />
          Player Battle
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLowData ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">{dataStatus}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Need at least 10 balls for meaningful stats
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Players */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {getInitials(batterLabel)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{batterLabel}</p>
                  <p className="text-xs text-muted-foreground">Batter</p>
                </div>
              </div>
              
              <div className="text-2xl text-muted-foreground">vs</div>
              
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium text-foreground text-right">{bowlerLabel}</p>
                  <p className="text-xs text-muted-foreground text-right">Bowler</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-accent">
                    {getInitials(bowlerLabel)}
                  </span>
                </div>
              </div>
            </div>

            {/* Dominance Badge */}
            <div className="flex justify-center">
              <Badge variant={getBadgeVariant()} className="text-sm px-4 py-1">
                {dominanceTag}
              </Badge>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-xl font-bold text-foreground">{runs || 0}</p>
                <p className="text-xs text-muted-foreground">Runs</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-xl font-bold text-foreground">{balls || 0}</p>
                <p className="text-xs text-muted-foreground">Balls</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-xl font-bold text-foreground">{dismissals || 0}</p>
                <p className="text-xs text-muted-foreground">Dismissals</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-xl font-bold text-foreground">{strikeRate?.toFixed(1) || '-'}</p>
                <p className="text-xs text-muted-foreground">SR</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
