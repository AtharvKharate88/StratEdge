import Card, { CardHeader, CardTitle, CardContent } from '@/shared/components/Card.jsx'
import Badge from '@/shared/components/Badge.jsx'
import { cn, getInitials } from '@/shared/utils'
import { Star, TrendingUp, TrendingDown } from 'lucide-react'

export function TopPlayersCard({ players = [] }) {
  const topFive = players.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Top Impact Players
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topFive.map((player, index) => (
            <div
              key={player.player || index}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Rank */}
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                index === 0 && 'bg-yellow-500/20 text-yellow-500',
                index === 1 && 'bg-gray-400/20 text-gray-400',
                index === 2 && 'bg-orange-600/20 text-orange-600',
                index > 2 && 'bg-secondary text-muted-foreground'
              )}>
                {index + 1}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {getInitials(player.player || 'Player')}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground break-words">
                  {player.player}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{player.avgRuns?.toFixed(0) || '-'} runs</span>
                  <span>|</span>
                  <span>SR: {player.strikeRate?.toFixed(1) || '-'}</span>
                </div>
              </div>

              {/* Impact Score */}
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {player.impactScore?.toFixed(1) || '-'}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {player.formFactor > 1 ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-green-500">In Form</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-3 h-3 text-destructive" />
                      <span className="text-destructive">Out of Form</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
