import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ requireAdmin = false }) {
  const { isAuthenticated, isAdmin } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requireAdmin && !isAdmin) return <Navigate to="/pdv" replace />

  return <Outlet />
}
