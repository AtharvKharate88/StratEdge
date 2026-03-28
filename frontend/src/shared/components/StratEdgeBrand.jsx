import { cn } from '@/shared/utils'

/** App icon from `public/icon.svg` — gradient analytics mark. */
export function StratEdgeMark({ className }) {
  return (
    <img
      src="/icon.svg"
      alt=""
      decoding="async"
      className={cn(
        'rounded-xl shadow-lg shadow-violet-500/25 ring-1 ring-white/10 select-none',
        className
      )}
    />
  )
}

/** “Strat” + cyan “Edge” wordmark. */
export function StratEdgeWordmark({ className, size = 'lg' }) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-lg', xl: 'text-3xl' }
  return (
    <span className={cn('font-bold tracking-tight text-foreground', sizes[size], className)}>
      Strat<span className="text-cyan-400 font-extrabold">Edge</span>
    </span>
  )
}
