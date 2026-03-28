import { cn } from '@/shared/utils'
import { StratEdgeLogoSvg } from './StratEdgeLogoSvg.jsx'

/**
 * StratEdge brand lockup (SVG). Scales with layout; theme glow matches app chrome.
 */
export function StratEdgeMark({ className, compact = false }) {
  return (
    <div
      className={cn(
        'select-none rounded-lg px-1 py-0.5',
        'ring-1 ring-violet-500/25',
        'shadow-[0_0_28px_-6px_rgba(139,92,246,0.35),0_0_24px_-10px_rgba(34,211,238,0.2)]',
        compact ? 'max-w-[7.25rem]' : 'w-full max-w-full',
        className
      )}
    >
      <StratEdgeLogoSvg compact={compact} />
    </div>
  )
}

/** Plain text wordmark when SVG is not used. */
export function StratEdgeWordmark({ className, size = 'lg' }) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-lg', xl: 'text-3xl' }
  return (
    <span className={cn('font-bold tracking-tight text-foreground', sizes[size], className)}>
      Strat<span className="text-cyan-400 font-extrabold">Edge</span>
    </span>
  )
}
