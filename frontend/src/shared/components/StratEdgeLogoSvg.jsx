import { useId } from 'react'
import { cn } from '@/shared/utils'

/**
 * Vector StratEdge logo: script wordmark, swoosh, cricket ball, tagline.
 * Scales cleanly; no raster. Fills use theme-friendly gradients on dark UI.
 */
export function StratEdgeLogoSvg({ className, compact = false }) {
  const uid = useId().replace(/:/g, '')

  const mainSize = compact ? 38 : 52
  const tagSize = compact ? 7 : 9
  const vbW = compact ? 340 : 420
  const vbH = compact ? 76 : 92

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="StratEdge — Cricket predictions"
      className={cn('block w-full h-auto', className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient
          id={`se-wm-${uid}`}
          x1="0"
          y1="0"
          x2={vbW}
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ede9fe" />
          <stop offset="0.45" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#67e8f9" />
        </linearGradient>
        <linearGradient id={`se-sw-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id={`se-ball-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f8fafc" />
          <stop offset="1" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      {/* Swoosh under “Strat” — drawn first so wordmark sits on top */}
      <path
        d={
          compact
            ? 'M 10 52 Q 72 60 128 50 T 168 52'
            : 'M 12 62 Q 96 74 188 60 T 248 62'
        }
        stroke={`url(#se-sw-${uid})`}
        strokeWidth={compact ? 3.5 : 5}
        strokeLinecap="round"
        fill="none"
        opacity={0.92}
      />

      {/* Script wordmark — Satisfy loaded in index.html */}
      <text
        x={compact ? 6 : 8}
        y={compact ? 44 : 54}
        fontFamily="'Satisfy', cursive"
        fontSize={mainSize}
        fill={`url(#se-wm-${uid})`}
      >
        StratEdge
      </text>

      {/* Cricket ball — top-right of wordmark */}
      <g transform={compact ? 'translate(232, 2)' : 'translate(300, 4)'}>
        <circle cx="18" cy="18" r="16" fill={`url(#se-ball-${uid})`} opacity={0.98} />
        <circle cx="18" cy="18" r="16" fill="none" stroke="#0f172a" strokeOpacity={0.12} strokeWidth="1" />
        <path
          d="M 18 4 L 18 32"
          stroke="#0f172a"
          strokeOpacity={0.28}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M 18 18 C 10 12 4 18 4 18 C 4 18 10 24 18 18"
          fill="none"
          stroke="#0f172a"
          strokeOpacity={0.2}
          strokeWidth="0.9"
        />
        <path
          d="M 18 18 C 26 12 32 18 32 18 C 32 18 26 24 18 18"
          fill="none"
          stroke="#0f172a"
          strokeOpacity={0.2}
          strokeWidth="0.9"
        />
      </g>

      {/* Tagline */}
      <text
        x={vbW / 2}
        y={compact ? 68 : 84}
        textAnchor="middle"
        fontFamily="'Montserrat', system-ui, sans-serif"
        fontSize={tagSize}
        fontWeight="600"
        letterSpacing={compact ? '0.28em' : '0.32em'}
        fill="#94a3b8"
      >
        CRICKET PREDICTIONS
      </text>
    </svg>
  )
}
