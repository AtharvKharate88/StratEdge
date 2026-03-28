import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/shared/utils'
import { PRIMARY_NAV } from '@/shared/constants/appNav'
import {
  Activity,
  LayoutDashboard,
  History,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const ICON_BY_PATH = {
  '/dashboard': LayoutDashboard,
  '/history': History,
  '/players': Users,
  '/venues': MapPin,
}

const navItems = PRIMARY_NAV.map((item) => ({
  ...item,
  icon: ICON_BY_PATH[item.path],
}))

export default function Sidebar({ collapsed, onCollapsedChange }) {
  const location = useLocation()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen glass border-r border-border z-40',
        'flex flex-col transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="text-lg font-bold text-foreground block leading-tight">CricketAI</span>
            <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5">
              IPL-style match & player insights
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.blurb}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-secondary',
                isActive && 'bg-primary/10 text-primary glow-purple',
                !isActive && 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <span className="font-medium text-left leading-snug">{item.label}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-border">
        <button
          type="button"
          onClick={() => onCollapsedChange?.(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
