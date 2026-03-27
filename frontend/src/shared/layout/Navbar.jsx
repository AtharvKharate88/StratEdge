import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/features/auth/AuthContext.jsx'
import { cn, getInitials } from '@/shared/utils'
import { Search, Bell, LogOut, User, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [notifications] = useState(3)
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
        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search predictions, players, venues..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

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
