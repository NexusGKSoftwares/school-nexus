import type React from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredUserType?: string
}

export default function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const user = localStorage.getItem("user")

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  const userData = JSON.parse(user)

  if (!userData.isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (requiredUserType && userData.userType !== requiredUserType) {
    // Redirect to appropriate dashboard based on user type
    const redirectMap = {
      student: "/student",
      lecturer: "/lecturer",
      admin: "/admin",
    }
    return <Navigate to={redirectMap[userData.userType as keyof typeof redirectMap] || "/auth/login"} replace />
  }

  return <>{children}</>
}
