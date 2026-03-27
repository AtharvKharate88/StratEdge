import { cn } from '@/shared/utils'
import { Shield } from 'lucide-react'

export function TrustScoreMeter({ score = 0 }) {
  const percentage = Math.min(Math.max(score * 100, 0), 100)
  
  const getColor = () => {
    if (percentage >= 80) return 'text-green-500'
    if (percentage >= 60) return 'text-accent'
    if (percentage >= 40) return 'text-yellow-500'
    return 'text-destructive'
  }

  const getLabel = () => {
    if (percentage >= 80) return 'High Confidence'
    if (percentage >= 60) return 'Good Confidence'
    if (percentage >= 40) return 'Moderate Confidence'
    return 'Low Confidence'
  }

  // Create gauge segments
  const segments = 20
  const activeSegments = Math.round((percentage / 100) * segments)

  return (
    <div className="p-4 rounded-lg bg-secondary/30 border border-border">
      <div className="flex items-center gap-3 mb-4">
        <Shield className={cn('w-5 h-5', getColor())} />
        <div>
          <p className="text-sm font-medium text-foreground">Trust Score</p>
          <p className="text-xs text-muted-foreground">{getLabel()}</p>
        </div>
        <span className={cn('ml-auto text-2xl font-bold', getColor())}>
          {percentage.toFixed(0)}%
        </span>
      </div>
      
      {/* Gauge */}
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 flex-1 rounded-full transition-all duration-300',
              i < activeSegments
                ? i < segments * 0.4
                  ? 'bg-destructive'
                  : i < segments * 0.6
                  ? 'bg-yellow-500'
                  : i < segments * 0.8
                  ? 'bg-accent'
                  : 'bg-green-500'
                : 'bg-secondary'
            )}
            style={{
              transitionDelay: `${i * 30}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
