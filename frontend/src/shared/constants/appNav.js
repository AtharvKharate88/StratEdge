/** Sidebar routes only — no page “how to use” copy here. */
export const PRIMARY_NAV = [
  { path: '/dashboard', label: 'Match predictions' },
  { path: '/history', label: 'Your history' },
  { path: '/players', label: 'Player analytics' },
  { path: '/venues', label: 'Venues' },
]

export function getNavMeta(pathname) {
  const hit = PRIMARY_NAV.find((n) => n.path === pathname)
  return hit || { label: 'StratEdge' }
}
