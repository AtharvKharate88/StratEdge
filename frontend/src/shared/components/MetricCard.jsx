import { useEffect, useRef, useState } from 'react'
import { cn } from '@/shared/utils'
import Card from './Card.jsx'

export default function MetricCard({ 
  icon: Icon, 
  title, 
  value, 
  suffix,
  change,
  trend,
  className,
  glow,
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const countRef = useRef(null)

  useEffect(() => {
    if (typeof value !== 'number') {
      setDisplayValue(value)
      return
    }

    const duration = 1000
    const steps = 60
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current += increment
      if (step >= steps) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <Card className={cn('animate-fade-in', className)} glow={glow}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground animate-count">
              {typeof displayValue === 'number' 
                ? displayValue.toLocaleString() 
                : displayValue}
            </span>
            {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn(
                'text-sm font-medium',
                trend === 'up' && 'text-green-500',
                trend === 'down' && 'text-destructive',
                !trend && 'text-muted-foreground'
              )}>
                {trend === 'up' && '+'}
                {change}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>
    </Card>
  )
}
