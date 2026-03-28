import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { cn } from '@/shared/utils'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen animated-bg">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className={cn(
          'min-w-0 transition-[margin] duration-300',
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        )}
      >
        <Navbar />
        <main className="p-6 w-full max-w-[100vw] box-border overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
