"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"

export default function FournisseurModuleContent() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Module Fournisseur</h1>
              <p className="text-gray-600">
                Bienvenue {user?.name} - {user?.companyName || "Interface fournisseur"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </div>

        {/* Rest of the fournisseur content */}
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Module Fournisseur</h2>
          <p className="text-gray-600">Contenu du module fournisseur en cours de développement...</p>
        </div>
      </div>
    </div>
  )
}
