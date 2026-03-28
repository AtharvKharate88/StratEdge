import { cn } from '@/shared/utils'

/**
 * Official StratEdge wordmark (PNG). Theme: soft violet + cyan glow on dark UI.
 * `compact` = smaller width for collapsed sidebar / tight spots.
 */
export function StratEdgeMark({ className, compact = false }) {
  return (
    <img
      src="/stratedge-logo.png"
      alt="StratEdge"
      decoding="async"
      className={cn(
        'object-contain object-left select-none',
        'rounded-lg bg-black/40 ring-1 ring-violet-500/35',
        'shadow-[0_0_24px_-4px_rgba(139,92,246,0.45),0_0_20px_-8px_rgba(34,211,238,0.25)]',
        compact ? 'h-9 max-w-[5.75rem]' : 'h-11 w-full max-w-[220px]',
        className
      )}
    />
  )
}

/** Optional text wordmark when no image is desired (e.g. tiny footer). */
export function StratEdgeWordmark({ className, size = 'lg' }) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-lg', xl: 'text-3xl' }
  return (
    <span className={cn('font-bold tracking-tight text-foreground', sizes[size], className)}>
      Strat<span className="text-cyan-400 font-extrabold">Edge</span>
    </span>
  )
}
