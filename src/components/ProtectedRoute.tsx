import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredUserType?: 'admin' | 'lecturer' | 'student'
}

export default function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user || !profile) {
    return <Navigate to="/auth/login" replace />
  }

  // Check if user has the required role
  if (requiredUserType && profile.role !== requiredUserType) {
    // Redirect to appropriate dashboard based on user role
    const redirectMap = {
      student: "/student",
      lecturer: "/lecturer",
      admin: "/admin",
    }
    return <Navigate to={redirectMap[profile.role] || "/auth/login"} replace />
  }

  return <>{children}</>
}
