"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ExportButton } from "@/components/export/export-button"
import { Shield, FileText, AlertTriangle, CheckCircle, Plus, Eye, Calendar, Award, BookOpen, Users } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function CompliancePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  // Mock compliance data
  const licenses = [
    {
      id: "LIC-001",
      name: "Licence de Distribution Pharmaceutique",
      type: "Distribution",
      status: "active",
      issueDate: "2023-01-15",
      expiryDate: "2025-01-15",
      authority: "ANSM",
      progress: 85,
    },
    {
      id: "LIC-002",
      name: "Certification ISO 9001",
      type: "Qualité",
      status: "expiring",
      issueDate: "2022-06-01",
      expiryDate: "2024-06-01",
      authority: "Bureau Veritas",
      progress: 95,
    },
    {
      id: "LIC-003",
      name: "Autorisation GDP",
      type: "Bonnes Pratiques",
      status: "active",
      issueDate: "2023-03-10",
      expiryDate: "2026-03-10",
      authority: "ANSM",
      progress: 100,
    },
  ]

  const audits = [
    {
      id: "AUD-001",
      title: "Audit Qualité Annuel",
      type: "Interne",
      status: "completed",
      date: "2024-01-15",
      auditor: "Marie Dubois",
      score: 92,
      findings: 3,
    },
    {
      id: "AUD-002",
      title: "Inspection ANSM",
      type: "Externe",
      status: "scheduled",
      date: "2024-02-20",
      auditor: "ANSM Inspector",
      score: null,
      findings: 0,
    },
    {
      id: "AUD-003",
      title: "Audit Fournisseur",
      type: "Fournisseur",
      status: "in-progress",
      date: "2024-01-30",
      auditor: "Jean Martin",
      score: null,
      findings: 1,
    },
  ]

  const trainings = [
    {
      id: "TRN-001",
      title: "Formation GDP",
      description: "Bonnes Pratiques de Distribution",
      status: "completed",
      completionRate: 100,
      participants: 25,
      dueDate: "2024-12-31",
    },
    {
      id: "TRN-002",
      title: "Sécurité Pharmaceutique",
      description: "Pharmacovigilance et sécurité",
      status: "in-progress",
      completionRate: 65,
      participants: 18,
      dueDate: "2024-03-15",
    },
    {
      id: "TRN-003",
      title: "Réglementation Européenne",
      description: "Mise à jour réglementaire",
      status: "pending",
      completionRate: 0,
      participants: 30,
      dueDate: "2024-04-30",
    },
  ]

  // Calculate compliance metrics
  const activeLicenses = licenses.filter((l) => l.status === "active").length
  const expiringLicenses = licenses.filter((l) => l.status === "expiring").length
  const completedAudits = audits.filter((a) => a.status === "completed").length
  const overallComplianceScore = Math.round(licenses.reduce((sum, l) => sum + l.progress, 0) / licenses.length)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return "bg-green-100 text-green-800"
      case "expiring":
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
      case "failed":
        return "bg-red-100 text-red-800"
      case "scheduled":
      case "pending":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif"
      case "expiring":
        return "Expire bientôt"
      case "expired":
        return "Expiré"
      case "completed":
        return "Terminé"
      case "in-progress":
        return "En cours"
      case "scheduled":
        return "Planifié"
      case "pending":
        return "En attente"
      case "failed":
        return "Échoué"
      default:
        return status
    }
  }

  const handleScheduleAudit = () => {
    toast({
      title: "Audit planifié",
      description: "Nouvel audit ajouté au calendrier",
    })
  }

  const handleStartTraining = (trainingId: string) => {
    toast({
      title: "Formation lancée",
      description: "Formation démarrée pour les participants",
    })
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "fournisseur"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <span>Conformité & Réglementation</span>
                </h1>
                <p className="text-gray-600">Gestion des licences, audits et formations</p>
              </div>
              <div className="flex items-center space-x-4">
                <ExportButton data={licenses} filename="conformite" />
                <Button onClick={handleScheduleAudit}>
                  <Plus className="w-4 h-4 mr-2" />
                  Planifier audit
                </Button>
              </div>
            </div>
          </div>

          {/* Compliance KPIs */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Score Conformité</p>
                    <p className="text-3xl font-bold text-green-900">{overallComplianceScore}%</p>
                    <p className="text-xs text-green-600 mt-1">Excellent niveau</p>
                  </div>
                  <Award className="w-12 h-12 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Licences Actives</p>
                    <p className="text-3xl font-bold text-blue-900">{activeLicenses}</p>
                    <p className="text-xs text-blue-600 mt-1">Sur {licenses.length} total</p>
                  </div>
                  <FileText className="w-12 h-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Expirations Proches</p>
                    <p className="text-3xl font-bold text-orange-900">{expiringLicenses}</p>
                    <p className="text-xs text-orange-600 mt-1">Action requise</p>
                  </div>
                  <AlertTriangle className="w-12 h-12 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Audits Terminés</p>
                    <p className="text-3xl font-bold text-purple-900">{completedAudits}</p>
                    <p className="text-xs text-purple-600 mt-1">Cette année</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="licenses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="licenses">Licences</TabsTrigger>
              <TabsTrigger value="audits">Audits</TabsTrigger>
              <TabsTrigger value="training">Formations</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Licenses Tab */}
            <TabsContent value="licenses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Licences et Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {licenses.map((license) => {
                      const daysUntilExpiry = Math.ceil(
                        (new Date(license.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      )

                      return (
                        <div key={license.id} className="border rounded-lg p-6 hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">{license.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>ID: {license.id}</span>
                                <span>Type: {license.type}</span>
                                <span>Autorité: {license.authority}</span>
                              </div>
                            </div>
                            <Badge className={getStatusColor(license.status)}>{getStatusText(license.status)}</Badge>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Date d'émission</p>
                              <p className="font-medium">{new Date(license.issueDate).toLocaleDateString("fr-FR")}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Date d'expiration</p>
                              <p className="font-medium">{new Date(license.expiryDate).toLocaleDateString("fr-FR")}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Jours restants</p>
                              <p className={`font-medium ${daysUntilExpiry < 90 ? "text-red-600" : "text-green-600"}`}>
                                {daysUntilExpiry} jours
                              </p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-600">Conformité</span>
                              <span className="text-sm font-medium">{license.progress}%</span>
                            </div>
                            <Progress value={license.progress} className="h-2" />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Voir détails
                            </Button>
                            {license.status === "expiring" && <Button size="sm">Renouveler</Button>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audits Tab */}
            <TabsContent value="audits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audits et Inspections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {audits.map((audit) => (
                      <div key={audit.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{audit.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <span>ID: {audit.id}</span>
                              <span>Type: {audit.type}</span>
                              <span>Auditeur: {audit.auditor}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Date: {new Date(audit.date).toLocaleDateString("fr-FR")}
                            </p>
                          </div>

                          <div className="flex items-center space-x-4">
                            {audit.score && (
                              <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{audit.score}%</p>
                                <p className="text-xs text-gray-500">Score</p>
                              </div>
                            )}
                            <Badge className={getStatusColor(audit.status)}>{getStatusText(audit.status)}</Badge>
                          </div>
                        </div>

                        {audit.findings > 0 && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm text-yellow-700 font-medium">
                                {audit.findings} observation(s) à traiter
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2 mt-4">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir rapport
                          </Button>
                          {audit.status === "scheduled" && (
                            <Button size="sm">
                              <Calendar className="w-4 h-4 mr-2" />
                              Modifier
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Training Tab */}
            <TabsContent value="training" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Formations et Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {trainings.map((training) => (
                      <div key={training.id} className="border rounded-lg p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{training.title}</h3>
                            <p className="text-gray-600 mb-2">{training.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>ID: {training.id}</span>
                              <span>Participants: {training.participants}</span>
                              <span>Échéance: {new Date(training.dueDate).toLocaleDateString("fr-FR")}</span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(training.status)}>{getStatusText(training.status)}</Badge>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Progression</span>
                            <span className="text-sm font-medium">{training.completionRate}%</span>
                          </div>
                          <Progress value={training.completionRate} className="h-2" />
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="outline">
                            <Users className="w-4 h-4 mr-2" />
                            Participants
                          </Button>
                          {training.status === "pending" && (
                            <Button size="sm" onClick={() => handleStartTraining(training.id)}>
                              <BookOpen className="w-4 h-4 mr-2" />
                              Démarrer
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Procédures Qualité</h3>
                    <p className="text-sm text-gray-600 mb-4">Documentation des processus</p>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Consulter
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Certificats</h3>
                    <p className="text-sm text-gray-600 mb-4">Certificats de conformité</p>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Consulter
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Réglementation</h3>
                    <p className="text-sm text-gray-600 mb-4">Textes réglementaires</p>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Consulter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
