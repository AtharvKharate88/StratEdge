import { cn } from '@/shared/utils'

const variants = {
  default: 'bg-secondary text-secondary-foreground',
  primary: 'bg-primary/20 text-primary border-primary/30',
  success: 'bg-green-500/20 text-green-500 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  danger: 'bg-destructive/20 text-destructive border-destructive/30',
  info: 'bg-accent/20 text-accent border-accent/30',
}

export default function Badge({ variant = 'default', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
