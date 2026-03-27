import { useHistory } from '../hooks/useHistory'
import Card, { CardHeader, CardTitle, CardContent } from '@/shared/components/Card.jsx'
import Badge from '@/shared/components/Badge.jsx'
import Button from '@/shared/components/Button.jsx'
import Empty from '@/shared/components/Empty.jsx'
import { SkeletonTable } from '@/shared/components/Skeleton.jsx'
import { cn, formatDate } from '@/shared/utils'
import { History as HistoryIcon, RefreshCw, TrendingUp, Shield } from 'lucide-react'

export default function History() {
  const { history, count, isLoading, refresh } = useHistory()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prediction History</h1>
          <p className="text-muted-foreground mt-1">
            {count} predictions made
          </p>
        </div>
        <Button variant="outline" onClick={refresh} disabled={isLoading}>
          <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-primary" />
            Recent Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <SkeletonTable rows={5} />}

          {!isLoading && history.length === 0 && (
            <Empty
              icon={HistoryIcon}
              title="No predictions yet"
              description="Start making predictions to see your history here."
            />
          )}

          {!isLoading && history.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Match</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Prediction</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Trust Score</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => {
                    const probA = item.probability?.[item.teamA] || 0.5
                    const probB = item.probability?.[item.teamB] || 0.5
                    const winner = probA > probB ? item.teamA : item.teamB
                    const winProb = Math.max(probA, probB)

                    return (
                      <tr
                        key={item.id || index}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{item.teamA}</span>
                            <span className="text-muted-foreground">vs</span>
                            <span className="font-medium text-foreground">{item.teamB}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span className="font-medium text-primary">{winner}</span>
                            <Badge variant="primary">
                              {(winProb * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Shield className={cn(
                              'w-4 h-4',
                              item.trustScore >= 0.7 ? 'text-green-500' : 
                              item.trustScore >= 0.5 ? 'text-accent' : 'text-yellow-500'
                            )} />
                            <span className="font-medium">
                              {(item.trustScore * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          {formatDate(item.createdAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
