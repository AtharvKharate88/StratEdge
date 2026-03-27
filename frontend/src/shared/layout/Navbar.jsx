import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext.jsx'
import { getNavMeta } from '@/shared/constants/appNav'
import { cn, getInitials } from '@/shared/utils'
import { LogOut, User, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const navMeta = getNavMeta(location.pathname)
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-16 glass border-b border-border sticky top-0 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Where you are + what this page is for (sidebar is the main navigator) */}
        <div className="min-w-0 max-w-xl">
          <p className="text-sm font-semibold text-foreground truncate">{navMeta.label}</p>
          {navMeta.blurb ? (
            <p className="text-xs text-muted-foreground truncate">{navMeta.blurb}</p>
          ) : null}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Profile Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user?.email ? getInitials(user.email) : 'U'}
                </span>
              </div>
              <ChevronDown className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                showDropdown && 'rotate-180'
              )} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 glass-card rounded-lg border border-border shadow-xl py-1 animate-fade-in">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.email || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cricket Analyst
                  </p>
                </div>
                <button
                  className="w-full px-4 py-2 flex items-center gap-3 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 flex items-center gap-3 text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
