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
    if (value === null || value === undefined) {
      setDisplayValue(null)
      return
    }

    let num = value
    if (typeof value === 'string') {
      const t = value.trim()
      if (!t || t.toLowerCase() === 'undefined') {
        setDisplayValue(null)
        return
      }
      const asNum = Number(t)
      if (!Number.isFinite(asNum)) {
        setDisplayValue(null)
        return
      }
      num = asNum
    }

    if (typeof num !== 'number' || Number.isNaN(num)) {
      setDisplayValue(null)
      return
    }

    const duration = 1000
    const steps = 60
    const increment = num / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current += increment
      if (step >= steps) {
        setDisplayValue(num)
        clearInterval(timer)
      } else {
        const isDecimal = Math.abs(num) < 100 && !Number.isInteger(num)
        setDisplayValue(isDecimal ? current : Math.floor(current))
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
              {displayValue === null ||
              displayValue === undefined ||
              (typeof displayValue === 'string' &&
                displayValue.trim().toLowerCase() === 'undefined')
                ? '—'
                : typeof displayValue === 'number'
                  ? Number.isFinite(displayValue)
                    ? displayValue.toLocaleString(undefined, {
                        maximumFractionDigits: 1,
                      })
                    : '—'
                  : '—'}
            </span>
            {suffix &&
              displayValue !== null &&
              displayValue !== undefined && (
                <span className="text-lg text-muted-foreground">{suffix}</span>
              )}
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
