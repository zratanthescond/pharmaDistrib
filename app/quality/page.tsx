"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useDataStore } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ExportButton } from "@/components/export/export-button"
import {
  Microscope,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Search,
  Plus,
  Eye,
  Award,
  TrendingUp,
  Package,
} from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function QualityPage() {
  const { user } = useAuth()
  const { products } = useDataStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  // Mock quality control data
  const qualityTests = [
    {
      id: "QT-001",
      productName: "Paracétamol 500mg",
      batchNumber: "LOT-2024-001",
      testType: "incoming",
      status: "passed",
      testDate: "2024-01-15",
      results: {
        purity: 99.8,
        dissolution: 95.2,
        uniformity: 98.5,
        identification: "Conforme",
      },
      inspector: "Dr. Marie Dubois",
      certificate: "CERT-001",
    },
    {
      id: "QT-002",
      productName: "Ibuprofène 400mg",
      batchNumber: "LOT-2024-002",
      testType: "outgoing",
      status: "failed",
      testDate: "2024-01-14",
      results: {
        purity: 97.2,
        dissolution: 88.1,
        uniformity: 94.8,
        identification: "Non conforme",
      },
      inspector: "Dr. Jean Martin",
      certificate: null,
    },
    {
      id: "QT-003",
      productName: "Amoxicilline 250mg",
      batchNumber: "LOT-2024-003",
      testType: "periodic",
      status: "in-progress",
      testDate: "2024-01-16",
      results: null,
      inspector: "Dr. Sophie Leroy",
      certificate: null,
    },
  ]

  const certificates = [
    {
      id: "CERT-001",
      productName: "Paracétamol 500mg",
      batchNumber: "LOT-2024-001",
      issueDate: "2024-01-15",
      validUntil: "2025-01-15",
      status: "active",
      type: "Certificat de Conformité",
    },
    {
      id: "CERT-002",
      productName: "Aspirine 100mg",
      batchNumber: "LOT-2024-004",
      issueDate: "2024-01-10",
      validUntil: "2025-01-10",
      status: "active",
      type: "Certificat d'Analyse",
    },
  ]

  const quarantineItems = [
    {
      id: "QR-001",
      productName: "Ibuprofène 400mg",
      batchNumber: "LOT-2024-002",
      quantity: 500,
      reason: "Échec test de dissolution",
      quarantineDate: "2024-01-14",
      status: "quarantined",
      action: "Investigation en cours",
    },
  ]

  // Calculate quality metrics
  const totalTests = qualityTests.length
  const passedTests = qualityTests.filter((t) => t.status === "passed").length
  const failedTests = qualityTests.filter((t) => t.status === "failed").length
  const inProgressTests = qualityTests.filter((t) => t.status === "in-progress").length
  const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0

  // Filter tests
  const filteredTests = qualityTests.filter((test) => {
    const matchesSearch =
      test.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || test.testType === selectedType
    return matchesSearch && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
      case "active":
        return "bg-green-100 text-green-800"
      case "failed":
      case "quarantined":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "passed":
        return "Conforme"
      case "failed":
        return "Non conforme"
      case "in-progress":
        return "En cours"
      case "active":
        return "Actif"
      case "quarantined":
        return "En quarantaine"
      case "expired":
        return "Expiré"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
      case "quarantined":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "in-progress":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  const handleNewTest = () => {
    toast({
      title: "Test planifié",
      description: "Nouveau test qualité ajouté au planning",
    })
  }

  const handleGenerateCertificate = (testId: string) => {
    toast({
      title: "Certificat généré",
      description: `Certificat de conformité créé pour ${testId}`,
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
                  <Microscope className="w-8 h-8 text-purple-600" />
                  <span>Contrôle Qualité</span>
                </h1>
                <p className="text-gray-600">Tests, certifications et gestion de la qualité</p>
              </div>
              <div className="flex items-center space-x-4">
                <ExportButton data={filteredTests} filename="controle-qualite" />
                <Button onClick={handleNewTest}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau test
                </Button>
              </div>
            </div>
          </div>

          {/* Quality KPIs */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Taux de Conformité</p>
                    <p className="text-3xl font-bold text-green-900">{passRate.toFixed(1)}%</p>
                    <p className="text-xs text-green-600 mt-1">Objectif: 95%</p>
                  </div>
                  <Award className="w-12 h-12 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Tests Conformes</p>
                    <p className="text-3xl font-bold text-blue-900">{passedTests}</p>
                    <p className="text-xs text-blue-600 mt-1">Sur {totalTests} tests</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Non Conformes</p>
                    <p className="text-3xl font-bold text-red-900">{failedTests}</p>
                    <p className="text-xs text-red-600 mt-1">Nécessite action</p>
                  </div>
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">En Quarantaine</p>
                    <p className="text-3xl font-bold text-yellow-900">{quarantineItems.length}</p>
                    <p className="text-xs text-yellow-600 mt-1">Lots bloqués</p>
                  </div>
                  <Package className="w-12 h-12 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="tests" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="tests">Tests Qualité</TabsTrigger>
              <TabsTrigger value="certificates">Certificats</TabsTrigger>
              <TabsTrigger value="quarantine">Quarantaine</TabsTrigger>
              <TabsTrigger value="analytics">Analyses</TabsTrigger>
            </TabsList>

            {/* Tests Tab */}
            <TabsContent value="tests" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher un test..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Type de test" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="incoming">Réception</SelectItem>
                        <SelectItem value="outgoing">Expédition</SelectItem>
                        <SelectItem value="periodic">Périodique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Tests List */}
              <Card>
                <CardHeader>
                  <CardTitle>Tests de Contrôle Qualité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {filteredTests.map((test) => (
                      <div key={test.id} className="border rounded-lg p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold">{test.productName}</h3>
                              {getStatusIcon(test.status)}
                              <Badge className={getStatusColor(test.status)}>{getStatusText(test.status)}</Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <span>ID: {test.id}</span>
                              <span>Lot: {test.batchNumber}</span>
                              <span>
                                Type:{" "}
                                {test.testType === "incoming"
                                  ? "Réception"
                                  : test.testType === "outgoing"
                                    ? "Expédition"
                                    : "Périodique"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Inspecteur: {test.inspector} • Date: {new Date(test.testDate).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>

                        {test.results && (
                          <div className="grid md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Pureté</p>
                              <p className="text-lg font-bold text-blue-600">{test.results.purity}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Dissolution</p>
                              <p className="text-lg font-bold text-green-600">{test.results.dissolution}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Uniformité</p>
                              <p className="text-lg font-bold text-purple-600">{test.results.uniformity}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Identification</p>
                              <p
                                className={`text-sm font-bold ${test.results.identification === "Conforme" ? "text-green-600" : "text-red-600"}`}
                              >
                                {test.results.identification}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                          {test.status === "passed" && !test.certificate && (
                            <Button size="sm" onClick={() => handleGenerateCertificate(test.id)}>
                              <FileText className="w-4 h-4 mr-2" />
                              Générer certificat
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certificates Tab */}
            <TabsContent value="certificates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certificats de Conformité</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {certificates.map((cert) => (
                      <div key={cert.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold">
                              <FileText className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{cert.id}</h4>
                              <p className="text-sm text-gray-600">{cert.productName}</p>
                              <p className="text-xs text-gray-500">Lot: {cert.batchNumber}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <Badge className={getStatusColor(cert.status)}>{getStatusText(cert.status)}</Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              Émis: {new Date(cert.issueDate).toLocaleDateString("fr-FR")}
                            </p>
                            <p className="text-xs text-gray-500">
                              Expire: {new Date(cert.validUntil).toLocaleDateString("fr-FR")}
                            </p>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quarantine Tab */}
            <TabsContent value="quarantine" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Produits en Quarantaine</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quarantineItems.map((item) => (
                      <div key={item.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white">
                              <Package className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{item.productName}</h4>
                              <p className="text-sm text-gray-600">Lot: {item.batchNumber}</p>
                              <p className="text-sm text-red-600 font-medium">{item.reason}</p>
                              <p className="text-xs text-gray-500">
                                Quarantaine: {new Date(item.quarantineDate).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold text-red-600">{item.quantity} unités</p>
                            <Badge className="bg-red-100 text-red-800">En quarantaine</Badge>
                            <p className="text-xs text-gray-600 mt-1">{item.action}</p>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Détails
                            </Button>
                            <Button size="sm" variant="destructive">
                              Libérer
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Évolution de la Qualité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Graphique des taux de conformité</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Tests conformes</span>
                          <span className="text-sm text-gray-600">
                            {passedTests} ({passRate.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={passRate} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Tests non conformes</span>
                          <span className="text-sm text-gray-600">
                            {failedTests} ({((failedTests / totalTests) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={(failedTests / totalTests) * 100} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Tests en cours</span>
                          <span className="text-sm text-gray-600">
                            {inProgressTests} ({((inProgressTests / totalTests) * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={(inProgressTests / totalTests) * 100} className="h-2" />
                      </div>
                    </div>
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
