"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  Shield,
  FileText,
  Settings,
  AlertCircle,
  Eye,
  Download,
  BarChart3,
  TrendingUp,
  Database,
  Lock,
  UserPlus,
  Edit,
  Search,
  RefreshCw,
} from "lucide-react"
import { UserDetailsModal } from "@/components/modals/user-details-modal"
import { useToast } from "@/hooks/use-toast"
import { AddUserModal } from "@/components/modals/add-user-modal"

// Mock data
const users = [
  {
    id: 1,
    name: "Dr. Martin Dubois",
    email: "martin.dubois@pharmacie-centre.fr",
    role: "Pharmacien titulaire",
    type: "Client",
    status: "Actif",
    lastLogin: "2024-01-15 14:30",
    permissions: ["Commandes", "Factures", "Stocks"],
  },
  {
    id: 2,
    name: "Jean Dupont",
    email: "j.dupont@pharmalab.fr",
    role: "Responsable commercial",
    type: "Fournisseur",
    status: "Actif",
    lastLogin: "2024-01-15 09:15",
    permissions: ["Stocks", "Commandes", "Analytics"],
  },
  {
    id: 3,
    name: "Sophie Laurent",
    email: "s.laurent@admin.fr",
    role: "Administrateur",
    type: "Admin",
    status: "Actif",
    lastLogin: "2024-01-15 16:45",
    permissions: ["Tous droits"],
  },
]

const transactions = [
  {
    id: "TXN-2024-001",
    type: "Commande",
    client: "Pharmacie du Centre",
    fournisseur: "PharmaLab",
    amount: 1245.8,
    status: "Complétée",
    date: "2024-01-15 14:30",
  },
  {
    id: "TXN-2024-002",
    type: "Retour",
    client: "Pharmacie des Lilas",
    fournisseur: "MediSupply",
    amount: -156.4,
    status: "En cours",
    date: "2024-01-15 11:20",
  },
  {
    id: "TXN-2024-003",
    type: "Commande",
    client: "Hôpital Saint-Jean",
    fournisseur: "BioPharm",
    amount: 3456.2,
    status: "En attente",
    date: "2024-01-15 08:15",
  },
]

const businessRules = [
  {
    id: 1,
    name: "Seuil stock minimum",
    description: "Alerte automatique quand le stock descend sous ce seuil",
    value: "50 unités",
    category: "Stock",
    active: true,
  },
  {
    id: 2,
    name: "Délai de livraison standard",
    description: "Délai par défaut pour les livraisons",
    value: "24 heures",
    category: "Livraison",
    active: true,
  },
  {
    id: 3,
    name: "Remise volume",
    description: "Remise automatique pour commandes > 1000€",
    value: "5%",
    category: "Tarification",
    active: false,
  },
]

function AdminModuleContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserType, setSelectedUserType] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const { toast } = useToast()

  const filteredUsers = users.filter(
    (user) =>
      (selectedUserType === "all" || user.type.toLowerCase() === selectedUserType) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  const handleEditUser = (userId: string) => {
    toast({
      title: "Modification utilisateur",
      description: `Ouverture du formulaire de modification pour l'utilisateur ${userId}...`,
    })
  }

  const handleLockUser = (userId: string) => {
    toast({
      title: "Utilisateur verrouillé",
      description: "L'utilisateur a été temporairement verrouillé.",
    })
  }

  const handleAddUser = () => {
    setShowAddUser(true)
  }

  const handleExportReport = (reportType: string) => {
    toast({
      title: "Export en cours",
      description: `Génération du rapport ${reportType}...`,
    })
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: `Rapport ${reportType} téléchargé avec succès.`,
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Back-Office Administratif</h1>
              <p className="text-gray-600">Administration centralisée et supervision complète</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Rapport global
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Utilisateurs</span>
            </TabsTrigger>
            <TabsTrigger value="supervision" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Supervision</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Rapports</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Paramétrage</span>
            </TabsTrigger>
          </TabsList>

          {/* Gestion des utilisateurs */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Gestion des utilisateurs</span>
                </CardTitle>
                <CardDescription>
                  Clients et fournisseurs avec attribution de rôles et suivi des activités
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher un utilisateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={selectedUserType === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedUserType("all")}
                    >
                      Tous
                    </Button>
                    <Button
                      variant={selectedUserType === "client" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedUserType("client")}
                    >
                      Clients
                    </Button>
                    <Button
                      variant={selectedUserType === "fournisseur" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedUserType("fournisseur")}
                    >
                      Fournisseurs
                    </Button>
                    <Button
                      variant={selectedUserType === "admin" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedUserType("admin")}
                    >
                      Admins
                    </Button>
                  </div>
                  <Button onClick={handleAddUser}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Nouvel utilisateur
                  </Button>
                </div>

                {/* Users List */}
                <div className="space-y-4">
                  {filteredUsers.map((u) => (
                    <Card key={u.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold">{u.name}</h3>
                              <Badge
                                variant={u.type === "Admin" ? "default" : u.type === "Client" ? "secondary" : "outline"}
                              >
                                {u.type}
                              </Badge>
                              <Badge variant={u.status === "Actif" ? "default" : "destructive"}>{u.status}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{u.email}</p>
                            <p className="text-sm text-gray-600">{u.role}</p>
                            <p className="text-xs text-gray-500 mt-1">Dernière connexion: {u.lastLogin}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {u.permissions.map((permission, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleViewUser(u)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleEditUser(u.id)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleLockUser(u.id)}>
                              <Lock className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supervision des transactions */}
          <TabsContent value="supervision" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">1,245</div>
                  <p className="text-sm text-gray-600">Transactions aujourd'hui</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">€156K</div>
                  <p className="text-sm text-gray-600">Volume traité</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">23</div>
                  <p className="text-sm text-gray-600">Alertes actives</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">99.2%</div>
                  <p className="text-sm text-gray-600">Disponibilité système</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Supervision des transactions et des stocks</span>
                </CardTitle>
                <CardDescription>Avec alertes automatiques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <Card key={transaction.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{transaction.id}</h3>
                            <p className="text-sm text-gray-600">
                              {transaction.client} ↔ {transaction.fournisseur}
                            </p>
                            <p className="text-xs text-gray-500">{transaction.date}</p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {transaction.amount > 0 ? "+" : ""}
                              {transaction.amount.toFixed(2)}€
                            </p>
                            <Badge
                              variant={
                                transaction.status === "Complétée"
                                  ? "default"
                                  : transaction.status === "En cours"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Alertes automatiques */}
                <Card className="mt-6 border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <span>Alertes automatiques</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg">
                        <div>
                          <p className="font-medium text-red-900">Stock critique</p>
                          <p className="text-sm text-red-700">Paracétamol 500mg - Stock: 5 unités</p>
                        </div>
                        <Badge variant="destructive">Urgent</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-100 rounded-lg">
                        <div>
                          <p className="font-medium text-yellow-900">Commande en retard</p>
                          <p className="text-sm text-yellow-700">CMD-2024-001 - Retard de 2h</p>
                        </div>
                        <Badge className="bg-yellow-500">Attention</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Génération de rapports */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Génération de rapports détaillés</span>
                </CardTitle>
                <CardDescription>Export PDF ou Excel, tableaux de bord interactifs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5" />
                        <span>Rapport des ventes</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">
                        Analyse détaillée des ventes par période, produit et client
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Export Excel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Database className="w-5 h-5" />
                        <span>Rapport des stocks</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">État des stocks, mouvements et alertes</p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Export Excel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5" />
                        <span>Rapport financier</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">Chiffre d'affaires, marges et rentabilité</p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Export Excel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tableaux de bord interactifs */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Tableaux de bord interactifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Graphique des performances</p>
                      </div>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Analyse des tendances</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paramétrage des règles métier */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Paramétrage des règles métier</span>
                </CardTitle>
                <CardDescription>
                  Tarifs, promotions, seuils de stock, délais, workflows personnalisables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {businessRules.map((rule) => (
                    <Card key={rule.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold">{rule.name}</h3>
                              <Badge variant="outline">{rule.category}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                            <p className="text-sm font-medium text-blue-600">Valeur actuelle: {rule.value}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Switch checked={rule.active} />
                              <span className="text-sm">{rule.active ? "Actif" : "Inactif"}</span>
                            </div>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Workflows personnalisables */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Workflows personnalisables</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Workflow de commande</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Réception commande</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Vérification stock</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Préparation</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Expédition</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="mt-4">
                            Personnaliser
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Workflow de retour</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span>Demande de retour</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span>Validation motif</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span>Récupération produit</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span>Avoir ou remboursement</span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="mt-4">
                            Personnaliser
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {showUserDetails && selectedUser && (
        <UserDetailsModal user={selectedUser} isOpen={showUserDetails} onClose={() => setShowUserDetails(false)} />
      )}
      {showAddUser && <AddUserModal isOpen={showAddUser} onClose={() => setShowAddUser(false)} />}
    </div>
  )
}

export default function AdminModule() {
  return (
    <ProtectedRoute requiredModule="admin">
      <AdminModuleContent />
    </ProtectedRoute>
  )
}
