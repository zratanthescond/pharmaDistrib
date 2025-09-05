"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportButton } from "@/components/export/export-button"
import { FileText, Folder, Upload, Download, Share2, Search, Eye, Edit, Trash2, Lock, Unlock } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function DocumentsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  // Mock documents data
  const documents = [
    {
      id: "DOC-001",
      name: "Procédure GDP - Bonnes Pratiques de Distribution",
      type: "procedure",
      category: "qualite",
      size: "2.4 MB",
      format: "PDF",
      uploadDate: "2024-01-15",
      lastModified: "2024-01-15",
      author: "Dr. Marie Dubois",
      version: "v2.1",
      status: "active",
      access: "public",
      downloads: 45,
      description: "Document détaillant les bonnes pratiques de distribution pharmaceutique",
    },
    {
      id: "DOC-002",
      name: "Certificat ISO 9001 - 2024",
      type: "certificate",
      category: "conformite",
      size: "1.8 MB",
      format: "PDF",
      uploadDate: "2024-01-10",
      lastModified: "2024-01-10",
      author: "Bureau Veritas",
      version: "v1.0",
      status: "active",
      access: "restricted",
      downloads: 12,
      description: "Certificat de conformité ISO 9001 pour l'année 2024",
    },
    {
      id: "DOC-003",
      name: "Rapport d'Audit Interne Q1 2024",
      type: "report",
      category: "audit",
      size: "5.2 MB",
      format: "PDF",
      uploadDate: "2024-01-08",
      lastModified: "2024-01-12",
      author: "Jean Martin",
      version: "v1.2",
      status: "active",
      access: "confidential",
      downloads: 8,
      description: "Rapport détaillé de l'audit interne du premier trimestre",
    },
    {
      id: "DOC-004",
      name: "Manuel Utilisateur - Système de Gestion",
      type: "manual",
      category: "formation",
      size: "8.7 MB",
      format: "PDF",
      uploadDate: "2024-01-05",
      lastModified: "2024-01-14",
      author: "Équipe IT",
      version: "v3.0",
      status: "active",
      access: "public",
      downloads: 156,
      description: "Guide complet d'utilisation du système de gestion",
    },
    {
      id: "DOC-005",
      name: "Contrat Fournisseur - PharmaSupply",
      type: "contract",
      category: "legal",
      size: "1.2 MB",
      format: "PDF",
      uploadDate: "2024-01-03",
      lastModified: "2024-01-03",
      author: "Service Juridique",
      version: "v1.0",
      status: "archived",
      access: "confidential",
      downloads: 3,
      description: "Contrat de partenariat avec le fournisseur PharmaSupply",
    },
  ]

  const folders = [
    {
      id: "FOLD-001",
      name: "Procédures Qualité",
      category: "qualite",
      documentsCount: 15,
      lastModified: "2024-01-15",
      access: "public",
    },
    {
      id: "FOLD-002",
      name: "Certificats et Licences",
      category: "conformite",
      documentsCount: 8,
      lastModified: "2024-01-12",
      access: "restricted",
    },
    {
      id: "FOLD-003",
      name: "Rapports d'Audit",
      category: "audit",
      documentsCount: 12,
      lastModified: "2024-01-10",
      access: "confidential",
    },
    {
      id: "FOLD-004",
      name: "Formations et Manuels",
      category: "formation",
      documentsCount: 25,
      lastModified: "2024-01-08",
      access: "public",
    },
  ]

  // Calculate document metrics
  const totalDocuments = documents.length
  const activeDocuments = documents.filter((d) => d.status === "active").length
  const archivedDocuments = documents.filter((d) => d.status === "archived").length
  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloads, 0)

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    const matchesType = selectedType === "all" || doc.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAccessColor = (access: string) => {
    switch (access) {
      case "public":
        return "bg-blue-100 text-blue-800"
      case "restricted":
        return "bg-orange-100 text-orange-800"
      case "confidential":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAccessIcon = (access: string) => {
    switch (access) {
      case "public":
        return <Unlock className="w-4 h-4" />
      case "restricted":
      case "confidential":
        return <Lock className="w-4 h-4" />
      default:
        return <Unlock className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "procedure":
        return <FileText className="w-5 h-5 text-blue-600" />
      case "certificate":
        return <FileText className="w-5 h-5 text-green-600" />
      case "report":
        return <FileText className="w-5 h-5 text-purple-600" />
      case "manual":
        return <FileText className="w-5 h-5 text-orange-600" />
      case "contract":
        return <FileText className="w-5 h-5 text-red-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const handleUploadDocument = () => {
    toast({
      title: "Document téléchargé",
      description: "Nouveau document ajouté à la bibliothèque",
    })
  }

  const handleShareDocument = (docId: string) => {
    toast({
      title: "Document partagé",
      description: `Lien de partage généré pour ${docId}`,
    })
  }

  const handleDownloadDocument = (docName: string) => {
    toast({
      title: "Téléchargement en cours",
      description: `${docName} en cours de téléchargement...`,
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <span>Gestion Documentaire</span>
                </h1>
                <p className="text-gray-600">Centralisation et partage des documents</p>
              </div>
              <div className="flex items-center space-x-4">
                <ExportButton data={filteredDocuments} filename="documents" />
                <Button onClick={handleUploadDocument}>
                  <Upload className="w-4 h-4 mr-2" />
                  Télécharger document
                </Button>
              </div>
            </div>
          </div>

          {/* Document KPIs */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Documents</p>
                    <p className="text-3xl font-bold text-blue-900">{totalDocuments}</p>
                    <p className="text-xs text-blue-600 mt-1">Bibliothèque complète</p>
                  </div>
                  <FileText className="w-12 h-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Documents Actifs</p>
                    <p className="text-3xl font-bold text-green-900">{activeDocuments}</p>
                    <p className="text-xs text-green-600 mt-1">En cours d'utilisation</p>
                  </div>
                  <Eye className="w-12 h-12 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Téléchargements</p>
                    <p className="text-3xl font-bold text-purple-900">{totalDownloads}</p>
                    <p className="text-xs text-purple-600 mt-1">Total des accès</p>
                  </div>
                  <Download className="w-12 h-12 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Dossiers</p>
                    <p className="text-3xl font-bold text-orange-900">{folders.length}</p>
                    <p className="text-xs text-orange-600 mt-1">Organisation</p>
                  </div>
                  <Folder className="w-12 h-12 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="documents" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="folders">Dossiers</TabsTrigger>
              <TabsTrigger value="recent">Récents</TabsTrigger>
            </TabsList>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher un document..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes catégories</SelectItem>
                        <SelectItem value="qualite">Qualité</SelectItem>
                        <SelectItem value="conformite">Conformité</SelectItem>
                        <SelectItem value="audit">Audit</SelectItem>
                        <SelectItem value="formation">Formation</SelectItem>
                        <SelectItem value="legal">Juridique</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous types</SelectItem>
                        <SelectItem value="procedure">Procédure</SelectItem>
                        <SelectItem value="certificate">Certificat</SelectItem>
                        <SelectItem value="report">Rapport</SelectItem>
                        <SelectItem value="manual">Manuel</SelectItem>
                        <SelectItem value="contract">Contrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Documents List */}
              <Card>
                <CardHeader>
                  <CardTitle>Bibliothèque de Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredDocuments.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">{getTypeIcon(doc.type)}</div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-1">{doc.name}</h4>
                              <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>ID: {doc.id}</span>
                                <span>Taille: {doc.size}</span>
                                <span>Format: {doc.format}</span>
                                <span>Version: {doc.version}</span>
                                <span>Auteur: {doc.author}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge className={getStatusColor(doc.status)}>
                                  {doc.status === "active" ? "Actif" : "Archivé"}
                                </Badge>
                                <Badge className={getAccessColor(doc.access)}>
                                  <div className="flex items-center space-x-1">
                                    {getAccessIcon(doc.access)}
                                    <span>
                                      {doc.access === "public"
                                        ? "Public"
                                        : doc.access === "restricted"
                                          ? "Restreint"
                                          : "Confidentiel"}
                                    </span>
                                  </div>
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right text-sm text-gray-500">
                              <p>Modifié: {new Date(doc.lastModified).toLocaleDateString("fr-FR")}</p>
                              <p>{doc.downloads} téléchargements</p>
                            </div>

                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(doc.name)}>
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleShareDocument(doc.id)}>
                                <Share2 className="w-4 h-4" />
                              </Button>
                              {user?.role === "admin" && (
                                <>
                                  <Button size="sm" variant="outline">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Folders Tab */}
            <TabsContent value="folders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organisation par Dossiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {folders.map((folder) => (
                      <Card key={folder.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                              <Folder className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{folder.name}</h3>
                              <p className="text-sm text-gray-600">{folder.documentsCount} documents</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">Dernière modification</span>
                              <span>{new Date(folder.lastModified).toLocaleDateString("fr-FR")}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Accès</span>
                              <Badge className={getAccessColor(folder.access)}>
                                <div className="flex items-center space-x-1">
                                  {getAccessIcon(folder.access)}
                                  <span>
                                    {folder.access === "public"
                                      ? "Public"
                                      : folder.access === "restricted"
                                        ? "Restreint"
                                        : "Confidentiel"}
                                  </span>
                                </div>
                              </Badge>
                            </div>
                          </div>

                          <div className="flex space-x-2 mt-4">
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              <Eye className="w-4 h-4 mr-2" />
                              Ouvrir
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recent Tab */}
            <TabsContent value="recent" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Documents Récents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {documents
                      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                      .slice(0, 5)
                      .map((doc) => (
                        <div key={doc.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          {getTypeIcon(doc.type)}
                          <div className="flex-1">
                            <h4 className="font-medium">{doc.name}</h4>
                            <p className="text-sm text-gray-600">
                              Modifié le {new Date(doc.lastModified).toLocaleDateString("fr-FR")} par {doc.author}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(doc.name)}>
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
