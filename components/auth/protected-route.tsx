"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { canAccessModule } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredModule?: string
  requiredPermission?: string
}

export function ProtectedRoute({ children, requiredModule, requiredPermission }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login")
        return
      }

      if (requiredModule && !canAccessModule(user, requiredModule)) {
        router.push("/unauthorized")
        return
      }

      if (
        requiredPermission &&
        user &&
        !user.permissions.includes("all") &&
        !user.permissions.includes(requiredPermission)
      ) {
        router.push("/unauthorized")
        return
      }
    }
  }, [isAuthenticated, isLoading, user, requiredModule, requiredPermission, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredModule && !canAccessModule(user, requiredModule)) {
    return null
  }

  if (
    requiredPermission &&
    user &&
    !user.permissions.includes("all") &&
    !user.permissions.includes(requiredPermission)
  ) {
    return null
  }

  return <>{children}</>
}
