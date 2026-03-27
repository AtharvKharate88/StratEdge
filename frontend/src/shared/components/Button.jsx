import { forwardRef } from 'react'
import { cn } from '@/shared/utils'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 glow-purple',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline: 'border border-border bg-transparent hover:bg-secondary text-foreground',
  ghost: 'hover:bg-secondary text-foreground',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  success: 'bg-green-600 text-white hover:bg-green-600/90',
}

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4',
  lg: 'h-12 px-6 text-lg',
  icon: 'h-10 w-10',
}

const Button = forwardRef(
  ({ className, variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'ripple',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
