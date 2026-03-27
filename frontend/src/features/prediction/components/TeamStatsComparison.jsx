import Card, { CardHeader, CardTitle, CardContent } from '@/shared/components/Card.jsx'
import { cn } from '@/shared/utils'
import { getTeamLogo } from '@/shared/constants'
import { BarChart3 } from 'lucide-react'

export function TeamStatsComparison({ teamA, teamB, stats }) {
  // Parse stats - assume stats has keys for each team
  const statsA = stats?.[teamA] || {}
  const statsB = stats?.[teamB] || {}

  const statItems = [
    { label: 'Win Rate', keyA: statsA.winRate, keyB: statsB.winRate, format: (v) => `${(v * 100).toFixed(1)}%` },
    { label: 'Avg Score', keyA: statsA.avgScore, keyB: statsB.avgScore, format: (v) => v?.toFixed(0) || '-' },
    { label: 'Form', keyA: statsA.recentForm, keyB: statsB.recentForm, format: (v) => v || '-' },
    { label: 'H2H Wins', keyA: statsA.h2hWins, keyB: statsB.h2hWins, format: (v) => v || '0' },
  ]
  const teamALogo = getTeamLogo(teamA)
  const teamBLogo = getTeamLogo(teamB)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Team Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 pb-3 border-b border-border">
            <div className="text-sm font-medium text-primary truncate inline-flex items-center gap-2">
              {teamALogo && <img src={teamALogo} alt={teamA} className="w-5 h-5 object-contain rounded-sm shrink-0" />}
              <span className="truncate">{teamA}</span>
            </div>
            <div className="text-sm text-muted-foreground text-center">Stat</div>
            <div className="text-sm font-medium text-accent text-right truncate inline-flex items-center justify-end gap-2">
              <span className="truncate">{teamB}</span>
              {teamBLogo && <img src={teamBLogo} alt={teamB} className="w-5 h-5 object-contain rounded-sm shrink-0" />}
            </div>
          </div>

          {/* Stats Rows */}
          {statItems.map((stat, index) => {
            const valueA = stat.keyA
            const valueB = stat.keyB
            const numA = typeof valueA === 'number' ? valueA : parseFloat(valueA) || 0
            const numB = typeof valueB === 'number' ? valueB : parseFloat(valueB) || 0
            const isABetter = numA > numB
            const isBBetter = numB > numA

            return (
              <div 
                key={stat.label} 
                className="grid grid-cols-3 gap-4 items-center"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn(
                  'text-lg font-semibold',
                  isABetter ? 'text-primary' : 'text-foreground'
                )}>
                  {stat.format(valueA)}
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  {stat.label}
                </div>
                <div className={cn(
                  'text-lg font-semibold text-right',
                  isBBetter ? 'text-accent' : 'text-foreground'
                )}>
                  {stat.format(valueB)}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
