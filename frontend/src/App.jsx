import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from '@/features/auth/AuthContext.jsx'
import { AppProvider } from '@/shared/context/AppContext.jsx'
import { Toaster } from '@/shared/components/Toaster.jsx'
import ProtectedRoute from '@/features/auth/ProtectedRoute.jsx'
import AppLayout from '@/shared/layout/AppLayout.jsx'
import LoadingScreen from '@/shared/components/LoadingScreen.jsx'

// Lazy load pages for performance
const Login = lazy(() => import('@/features/auth/pages/Login.jsx'))
const Signup = lazy(() => import('@/features/auth/pages/Signup.jsx'))
const Dashboard = lazy(() => import('@/features/prediction/pages/Dashboard.jsx'))
const History = lazy(() => import('@/features/history/pages/History.jsx'))
const PlayerAnalytics = lazy(() => import('@/features/player-analytics/pages/PlayerAnalytics.jsx'))
const VenueInsights = lazy(() => import('@/features/venue/pages/VenueInsights.jsx'))

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/players" element={<PlayerAnalytics />} />
                  <Route path="/venues" element={<VenueInsights />} />
                </Route>
              </Route>
              
              {/* Redirect root to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
