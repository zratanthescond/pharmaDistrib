"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import ClientModuleContent from "./client-content"

export default function ClientModule() {
  return (
    <ProtectedRoute requiredModule="client">
      <ClientModuleContent />
    </ProtectedRoute>
  )
}
