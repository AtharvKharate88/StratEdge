import { forwardRef } from 'react'
import { cn } from '@/shared/utils'

const Input = forwardRef(
  ({ className, icon, suffix, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-11 rounded-lg bg-secondary/50 border border-border',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon && 'pl-10',
              suffix && 'pr-10',
              error && 'border-destructive focus:ring-destructive',
              className
            )}
            style={{ paddingLeft: icon ? '2.5rem' : '0.75rem', paddingRight: suffix ? '2.5rem' : '0.75rem' }}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {suffix}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
