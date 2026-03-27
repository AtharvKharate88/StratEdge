/**
 * Single source for sidebar + top bar: what each area does and how it connects.
 */
export const PRIMARY_NAV = [
  {
    path: '/dashboard',
    label: 'Match predictions',
    /** Shown under navbar title on wide screens */
    blurb: 'Main output: win chances, team stats, optional venue & player matchup.',
  },
  {
    path: '/history',
    label: 'Your history',
    blurb: 'Predictions you already ran (saved on the server when you are logged in).',
  },
  {
    path: '/players',
    label: 'Player analytics',
    blurb: 'Impact rankings and batter-vs-bowler lookups from the same ball-by-ball data.',
  },
  {
    path: '/venues',
    label: 'Venues',
    blurb: 'How a ground tends to play: typical scores and pitch tags.',
  },
]

export function getNavMeta(pathname) {
  const hit = PRIMARY_NAV.find((n) => n.path === pathname)
  return hit || { label: 'CricketAI', blurb: '' }
}
