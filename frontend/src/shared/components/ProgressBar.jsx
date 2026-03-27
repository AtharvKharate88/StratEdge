import { cn } from '@/shared/utils'

export default function ProgressBar({ 
  value = 0, 
  max = 100, 
  showValue = true,
  color = 'primary',
  size = 'md',
  className,
  label,
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const colors = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-destructive',
    accent: 'bg-accent',
  }

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm text-muted-foreground">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium text-foreground">
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full rounded-full bg-secondary overflow-hidden', sizes[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function WinProbabilityBar({ teamA, teamB, probA, probB }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{teamA}</span>
        <span className="text-sm font-bold text-primary">{(probA * 100).toFixed(1)}%</span>
      </div>
      <div className="relative h-3 rounded-full bg-secondary overflow-hidden flex">
        <div
          className="h-full bg-gradient-to-r from-primary to-purple-400 transition-all duration-700 ease-out"
          style={{ width: `${probA * 100}%` }}
        />
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-accent transition-all duration-700 ease-out"
          style={{ width: `${probB * 100}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{teamB}</span>
        <span className="text-sm font-bold text-accent">{(probB * 100).toFixed(1)}%</span>
      </div>
    </div>
  )
}
