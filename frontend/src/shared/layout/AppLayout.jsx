import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'

export default function AppLayout() {
  return (
    <div className="min-h-screen animated-bg">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        <Navbar />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
