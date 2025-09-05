"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Database,
  TrendingUp,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Settings,
  FileText,
  Plus,
} from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { AddProductModal } from "@/components/modals/add-product-modal"

// Mock data
const stockData = [
  {
    id: 1,
    product: "Paracétamol 500mg",
    currentStock: 150,
    minStock: 50,
    maxStock: 300,
    monthlySales: 89,
    trend: "up",
    alert: false,
  },
  {
    id: 2,
    product: "Ibuprofène 400mg",
    currentStock: 25,
    minStock: 50,
    maxStock: 200,
    monthlySales: 156,
    trend: "down",
    alert: true,
  },
  {
    id: 3,
    product: "Amoxicilline 1g",
    currentStock: 180,
    minStock: 30,
    maxStock: 250,
    monthlySales: 45,
    trend: "stable",
    alert: false,
  },
]

const proposedOrders = [
  {
    id: 1,
    product: "Ibuprofène 400mg",
    currentStock: 25,
    suggestedQuantity: 100,
    reason: "Stock faible + forte demande",
    priority: "high",
  },
  {
    id: 2,
    product: "Vitamine D 1000UI",
    currentStock: 45,
    suggestedQuantity: 75,
    reason: "Saisonnalité",
    priority: "medium",
  },
]

const returns = [
  {
    id: "RET-2024-001",
    product: "Sirop toux enfant",
    quantity: 12,
    reason: "Date proche expiration",
    status: "En cours",
    date: "2024-01-15",
  },
  {
    id: "RET-2024-002",
    product: "Crème hydratante",
    quantity: 5,
    reason: "Défaut emballage",
    status: "Accepté",
    date: "2024-01-14",
  },
]

const salesSuggestions = [
  {
    pharmacy: "Pharmacie du Centre",
    product: "Complément vitaminé",
    reason: "Historique d'achat + saison",
    potential: "Élevé",
  },
  {
    pharmacy: "Pharmacie des Lilas",
    product: "Crème solaire",
    reason: "Approche été",
    potential: "Moyen",
  },
]

function FournisseurModuleContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [showAddProduct, setShowAddProduct] = useState(false)
  const { toast } = useToast()

  const handleValidateOrder = (productName: string) => {
    toast({
      title: "Commande validée",
      description: `Commande pour ${productName} validée avec succès.`,
    })
  }

  const handleRejectOrder = (productName: string) => {
    toast({
      title: "Commande rejetée",
      description: `Commande pour ${productName} rejetée.`,
    })
  }

  const handleValidateAllOrders = () => {
    toast({
      title: "Toutes les commandes validées",
      description: "Toutes les propositions ont été validées.",
    })
  }

  const handleViewDetails = (id: string) => {
    toast({
      title: "Détails",
      description: `Affichage des détails pour l'élément ${id}...`,
    })
  }

  const handleProposeSale = (pharmacy: string, product: string) => {
    toast({
      title: "Proposition envoyée",
      description: `Proposition de ${product} envoyée à ${pharmacy}.`,
    })
  }

  const handleScheduleVisit = (pharmacy: string) => {
    toast({
      title: "Visite planifiée",
      description: `Visite chez ${pharmacy} planifiée.`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Module Fournisseur</h1>
              <p className="text-gray-600">Outils puissants pour optimiser vos opérations</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => toast({ title: "Actualisation", description: "Module en cours d'actualisation" })}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button onClick={() => toast({ title: "Exportation", description: "Module en cours d'exportation" })}>
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="stocks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="stocks" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span>Stocks</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Commandes</span>
            </TabsTrigger>
            <TabsTrigger value="returns" className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Retours</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Ventes</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytique</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Administration</span>
            </TabsTrigger>
          </TabsList>

          {/* Consultation des stocks */}
          <TabsContent value="stocks" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">1,245</div>
                  <p className="text-sm text-gray-600">Produits en stock</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">23</div>
                  <p className="text-sm text-gray-600">Alertes stock faible</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <p className="text-sm text-gray-600">Taux de disponibilité</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">€2.1M</div>
                  <p className="text-sm text-gray-600">Valeur stock</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>Consultation des stocks en temps réel</span>
                </CardTitle>
                <CardDescription>Visualisation des ventes mensuelles et alertes automatiques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Gestion des stocks</h3>
                  <Button onClick={() => setShowAddProduct(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un produit
                  </Button>
                </div>
                <div className="space-y-4">
                  {stockData.map((item) => (
                    <Card key={item.id} className={item.alert ? "border-red-200 bg-red-50" : ""}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{item.product}</h3>
                            <p className="text-sm text-gray-600">Ventes mensuelles: {item.monthlySales} unités</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {item.alert && (
                              <Badge variant="destructive">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Stock faible
                              </Badge>
                            )}
                            <Badge
                              variant={
                                item.trend === "up" ? "default" : item.trend === "down" ? "destructive" : "secondary"
                              }
                            >
                              {item.trend === "up" ? "↗" : item.trend === "down" ? "↘" : "→"}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Stock actuel: {item.currentStock}</span>
                            <span>
                              Min: {item.minStock} | Max: {item.maxStock}
                            </span>
                          </div>
                          <Progress
                            value={(item.currentStock / item.maxStock) * 100}
                            className={item.alert ? "bg-red-100" : ""}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
            {showAddProduct && <AddProductModal isOpen={showAddProduct} onClose={() => setShowAddProduct(false)} />}
          </TabsContent>

          {/* Proposition de commandes */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Proposition de commandes</span>
                </CardTitle>
                <CardDescription>
                  Basée sur les stocks actualisés, avec validation par le service d'approvisionnement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proposedOrders.map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold">{order.product}</h3>
                            <p className="text-sm text-gray-600 mt-1">{order.reason}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-sm">
                                Stock actuel: <span className="font-medium">{order.currentStock}</span>
                              </span>
                              <span className="text-sm">
                                Quantité suggérée:{" "}
                                <span className="font-medium text-blue-600">{order.suggestedQuantity}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                order.priority === "high"
                                  ? "destructive"
                                  : order.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {order.priority === "high" ? "Urgent" : order.priority === "medium" ? "Moyen" : "Faible"}
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => handleValidateOrder(order.product)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Valider
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleRejectOrder(order.product)}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-blue-900">Commandes en attente de validation</h3>
                      <p className="text-sm text-blue-700">2 propositions nécessitent votre attention</p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleValidateAllOrders}>
                      Valider toutes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suivi des retours */}
          <TabsContent value="returns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <RefreshCw className="w-5 h-5" />
                  <span>Suivi des retours</span>
                </CardTitle>
                <CardDescription>Traitement accéléré via un tableau de suivi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">5</div>
                      <p className="text-sm text-gray-600">Retours en cours</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">23</div>
                      <p className="text-sm text-gray-600">Retours acceptés</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-red-600">2</div>
                      <p className="text-sm text-gray-600">Retours refusés</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  {returns.map((returnItem) => (
                    <Card key={returnItem.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{returnItem.id}</h3>
                            <p className="text-sm text-gray-600">
                              {returnItem.product} • Quantité: {returnItem.quantity}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Motif: {returnItem.reason}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                returnItem.status === "Accepté"
                                  ? "default"
                                  : returnItem.status === "En cours"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {returnItem.status}
                            </Badge>
                            <p className="text-sm text-gray-500 mt-1">{returnItem.date}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(returnItem.id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suggestion de ventes */}
          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Suggestion de ventes en ligne</span>
                </CardTitle>
                <CardDescription>Lors des visites chez les pharmaciens</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesSuggestions.map((suggestion, index) => (
                    <Card key={index} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{suggestion.pharmacy}</h3>
                            <p className="text-lg text-blue-600 mt-1">{suggestion.product}</p>
                            <p className="text-sm text-gray-600 mt-2">{suggestion.reason}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                suggestion.potential === "Élevé"
                                  ? "default"
                                  : suggestion.potential === "Moyen"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              Potentiel {suggestion.potential}
                            </Badge>
                            <div className="flex space-x-2 mt-2">
                              <Button
                                size="sm"
                                onClick={() => handleProposeSale(suggestion.pharmacy, suggestion.product)}
                              >
                                Proposer
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleScheduleVisit(suggestion.pharmacy)}
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                Planifier
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="mt-6 bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-green-900">Opportunités de vente</h3>
                        <p className="text-sm text-green-700">
                          2 suggestions à fort potentiel identifiées cette semaine
                        </p>
                      </div>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          toast({ title: "Opportunités", description: "Affichage de toutes les opportunités" })
                        }
                      >
                        Voir toutes les opportunités
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tableau de bord analytique */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Tableau de bord analytique</span>
                </CardTitle>
                <CardDescription>Pour ajuster la stratégie commerciale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">+15%</div>
                      <p className="text-sm text-gray-600">Croissance CA</p>
                      <p className="text-xs text-green-600">vs mois dernier</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">92%</div>
                      <p className="text-sm text-gray-600">Taux de service</p>
                      <p className="text-xs text-green-600">+2% vs objectif</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">156</div>
                      <p className="text-sm text-gray-600">Pharmacies actives</p>
                      <p className="text-xs text-blue-600">+8 ce mois</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">4.8</div>
                      <p className="text-sm text-gray-600">Satisfaction client</p>
                      <p className="text-xs text-green-600">Excellent</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <LineChart className="w-5 h-5" />
                        <span>Évolution des ventes</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Graphique des ventes mensuelles</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <PieChart className="w-5 h-5" />
                        <span>Répartition par catégorie</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Graphique en secteurs</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interface d'administration */}
          <TabsContent value="admin" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Interface d'administration</span>
                </CardTitle>
                <CardDescription>
                  Gestion des utilisateurs, attribution de profils, droits d'accès configurables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Gestion des utilisateurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Jean Dupont</p>
                            <p className="text-sm text-gray-600">Responsable commercial</p>
                          </div>
                          <Badge>Admin</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Marie Martin</p>
                            <p className="text-sm text-gray-600">Gestionnaire stocks</p>
                          </div>
                          <Badge variant="secondary">Utilisateur</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Pierre Durand</p>
                            <p className="text-sm text-gray-600">Visiteur médical</p>
                          </div>
                          <Badge variant="outline">Lecture seule</Badge>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            toast({
                              title: "Gestion des utilisateurs",
                              description: "Affichage de l'interface de gestion des utilisateurs",
                            })
                          }
                        >
                          Gérer les utilisateurs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Sécurité et traçabilité</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Authentification 2FA</span>
                          <Badge className="bg-green-100 text-green-800">Activée</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Logs d'activité</span>
                          <Badge className="bg-blue-100 text-blue-800">Actifs</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Sauvegarde automatique</span>
                          <Badge className="bg-green-100 text-green-800">Quotidienne</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Chiffrement données</span>
                          <Badge className="bg-green-100 text-green-800">AES-256</Badge>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            toast({
                              title: "Rapport de sécurité",
                              description: "Téléchargement du rapport de sécurité",
                            })
                          }
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Rapport de sécurité
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function FournisseurModule() {
  return (
    <ProtectedRoute requiredModule="fournisseur">
      <FournisseurModuleContent />
    </ProtectedRoute>
  )
}
