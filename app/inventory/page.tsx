"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useDataStore } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Plus,
  Minus,
  Eye,
  Edit,
  RefreshCw,
  BarChart3,
  Warehouse,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ExportButton } from "@/components/export/export-button"

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSupplier, setSelectedSupplier] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")

  const { products, updateProduct } = useDataStore()
  const { toast } = useToast()

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSupplier = selectedSupplier === "all" || product.supplier === selectedSupplier
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && product.stock <= product.minStock) ||
      (stockFilter === "critical" && product.stock <= 5) ||
      (stockFilter === "good" && product.stock > product.minStock)

    return matchesSearch && matchesCategory && matchesSupplier && matchesStock
  })

  // Calculate inventory metrics
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock)
  const criticalStockProducts = products.filter((p) => p.stock <= 5)
  const expiringProducts = products.filter((p) => {
    const expiryDate = new Date(p.expiryDate)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return expiryDate <= thirtyDaysFromNow
  })

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)
  const categories = [...new Set(products.map((p) => p.category))]
  const suppliers = [...new Set(products.map((p) => p.supplier))]

  // Stock movement simulation
  const stockMovements = [
    {
      id: 1,
      product: "Paracétamol 500mg",
      type: "in",
      quantity: 100,
      date: "2024-01-15",
      reason: "Réapprovisionnement",
    },
    { id: 2, product: "Amoxicilline 250mg", type: "out", quantity: 50, date: "2024-01-15", reason: "Commande client" },
    {
      id: 3,
      product: "Ibuprofène 400mg",
      type: "in",
      quantity: 75,
      date: "2024-01-14",
      reason: "Livraison fournisseur",
    },
    { id: 4, product: "Aspirine 100mg", type: "out", quantity: 25, date: "2024-01-14", reason: "Vente directe" },
    {
      id: 5,
      product: "Doliprane 1000mg",
      type: "adjustment",
      quantity: -5,
      date: "2024-01-13",
      reason: "Inventaire physique",
    },
  ]

  const handleStockUpdate = (productId: string, newStock: number) => {
    if (newStock < 0) return

    updateProduct(productId, { stock: newStock })
    toast({
      title: "Stock mis à jour",
      description: `Stock modifié avec succès`,
    })
  }

  const handleReorder = (product: any) => {
    const reorderQuantity = Math.max(product.minStock * 2, 100)
    updateProduct(product.id, { stock: product.stock + reorderQuantity })
    toast({
      title: "Commande de réapprovisionnement",
      description: `${reorderQuantity} unités commandées pour ${product.name}`,
    })
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "fournisseur"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gestion des Stocks
                </h1>
                <p className="text-gray-600 text-lg">Suivi en temps réel de l'inventaire pharmaceutique</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="border-blue-200 hover:bg-blue-50 bg-transparent">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
                <ExportButton
                  data={filteredProducts.map((p) => ({
                    Nom: p.name,
                    Catégorie: p.category,
                    Stock: p.stock,
                    "Stock Min": p.minStock,
                    Prix: p.price,
                    Fournisseur: p.supplier,
                    "Date d'expiration": new Date(p.expiryDate).toLocaleDateString("fr-FR"),
                  }))}
                  filename="inventaire"
                />
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Total Produits</p>
                      <p className="text-3xl font-bold">{totalProducts}</p>
                    </div>
                    <Package className="w-12 h-12 text-blue-200" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-blue-100">Valeur: €{totalValue.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100">Stock Faible</p>
                      <p className="text-3xl font-bold">{lowStockProducts.length}</p>
                    </div>
                    <AlertTriangle className="w-12 h-12 text-orange-200" />
                  </div>
                  <div className="mt-4">
                    <Progress value={(lowStockProducts.length / totalProducts) * 100} className="bg-orange-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100">Stock Critique</p>
                      <p className="text-3xl font-bold">{criticalStockProducts.length}</p>
                    </div>
                    <XCircle className="w-12 h-12 text-red-200" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-red-100">Action immédiate requise</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100">Expiration Proche</p>
                      <p className="text-3xl font-bold">{expiringProducts.length}</p>
                    </div>
                    <Clock className="w-12 h-12 text-yellow-200" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-yellow-100">{"< 30 jours"}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="inventory" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
              <TabsTrigger value="inventory" className="flex items-center space-x-2">
                <Warehouse className="w-4 h-4" />
                <span>Inventaire</span>
              </TabsTrigger>
              <TabsTrigger value="movements" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Mouvements</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Alertes</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analyses</span>
              </TabsTrigger>
            </TabsList>

            {/* Inventory Management */}
            <TabsContent value="inventory" className="space-y-6">
              {/* Filters */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes catégories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Fournisseur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous fournisseurs</SelectItem>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier} value={supplier}>
                            {supplier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={stockFilter} onValueChange={setStockFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="État du stock" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les stocks</SelectItem>
                        <SelectItem value="good">Stock normal</SelectItem>
                        <SelectItem value="low">Stock faible</SelectItem>
                        <SelectItem value="critical">Stock critique</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" className="border-blue-200 hover:bg-blue-50 bg-transparent">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtres avancés
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Products Grid */}
              <div className="grid gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-semibold">{product.name}</h3>
                            <Badge variant="outline">{product.category}</Badge>
                            {product.stock <= product.minStock && (
                              <Badge variant="destructive" className="animate-pulse">
                                Stock faible
                              </Badge>
                            )}
                            {product.stock <= 5 && <Badge variant="destructive">Critique</Badge>}
                          </div>

                          <p className="text-gray-600 mb-3">{product.description}</p>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Fournisseur</p>
                              <p className="font-medium">{product.supplier}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Prix unitaire</p>
                              <p className="font-medium text-green-600">€{product.price.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Expiration</p>
                              <p className="font-medium">{new Date(product.expiryDate).toLocaleDateString("fr-FR")}</p>
                            </div>
                          </div>

                          {/* Stock Level */}
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Niveau de stock</span>
                              <span className="text-sm text-gray-500">
                                {product.stock} / {product.minStock} min
                              </span>
                            </div>
                            <Progress
                              value={(product.stock / (product.minStock * 2)) * 100}
                              className={`h-2 ${product.stock <= product.minStock ? "bg-red-100" : "bg-green-100"}`}
                            />
                          </div>
                        </div>

                        <div className="ml-6 text-right">
                          <div className="mb-4">
                            <p className="text-3xl font-bold text-blue-600">{product.stock}</p>
                            <p className="text-sm text-gray-500">unités</p>
                          </div>

                          <div className="flex items-center space-x-2 mb-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStockUpdate(product.id, product.stock - 10)}
                              disabled={product.stock < 10}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStockUpdate(product.id, product.stock + 10)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {product.stock <= product.minStock && (
                              <Button
                                size="sm"
                                className="w-full bg-orange-500 hover:bg-orange-600"
                                onClick={() => handleReorder(product)}
                              >
                                Réapprovisionner
                              </Button>
                            )}
                            <Button size="sm" variant="outline" className="w-full bg-transparent">
                              <Eye className="w-4 h-4 mr-2" />
                              Détails
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <Card className="shadow-lg border-0">
                  <CardContent className="p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
                    <p className="text-gray-400">Modifiez vos critères de recherche</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Stock Movements */}
            <TabsContent value="movements" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span>Mouvements de Stock</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stockMovements.map((movement) => (
                      <div key={movement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              movement.type === "in"
                                ? "bg-green-100"
                                : movement.type === "out"
                                  ? "bg-red-100"
                                  : "bg-yellow-100"
                            }`}
                          >
                            {movement.type === "in" && <TrendingUp className="w-5 h-5 text-green-600" />}
                            {movement.type === "out" && <TrendingDown className="w-5 h-5 text-red-600" />}
                            {movement.type === "adjustment" && <Edit className="w-5 h-5 text-yellow-600" />}
                          </div>
                          <div>
                            <h4 className="font-semibold">{movement.product}</h4>
                            <p className="text-sm text-gray-600">{movement.reason}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              movement.type === "in"
                                ? "text-green-600"
                                : movement.type === "out"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                            }`}
                          >
                            {movement.type === "in" ? "+" : movement.type === "out" ? "-" : ""}
                            {Math.abs(movement.quantity)}
                          </p>
                          <p className="text-sm text-gray-500">{movement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alerts */}
            <TabsContent value="alerts" className="space-y-6">
              <div className="grid gap-6">
                {/* Critical Stock Alert */}
                {criticalStockProducts.length > 0 && (
                  <Card className="shadow-lg border-0 border-l-4 border-l-red-500">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-red-700">
                        <XCircle className="w-5 h-5" />
                        <span>Stock Critique - Action Immédiate</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {criticalStockProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200"
                          >
                            <div>
                              <h4 className="font-semibold text-red-800">{product.name}</h4>
                              <p className="text-sm text-red-600">Stock: {product.stock} unités (Critique: ≤ 5)</p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleReorder(product)}
                            >
                              Commande urgente
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Low Stock Alert */}
                {lowStockProducts.length > 0 && (
                  <Card className="shadow-lg border-0 border-l-4 border-l-orange-500">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-orange-700">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Stock Faible - Réapprovisionnement Recommandé</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {lowStockProducts
                          .filter((p) => p.stock > 5)
                          .map((product) => (
                            <div
                              key={product.id}
                              className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200"
                            >
                              <div>
                                <h4 className="font-semibold text-orange-800">{product.name}</h4>
                                <p className="text-sm text-orange-600">
                                  Stock: {product.stock} / Min: {product.minStock}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
                                onClick={() => handleReorder(product)}
                              >
                                Réapprovisionner
                              </Button>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Expiring Products Alert */}
                {expiringProducts.length > 0 && (
                  <Card className="shadow-lg border-0 border-l-4 border-l-yellow-500">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-yellow-700">
                        <Clock className="w-5 h-5" />
                        <span>Produits Expirant Bientôt</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {expiringProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                          >
                            <div>
                              <h4 className="font-semibold text-yellow-800">{product.name}</h4>
                              <p className="text-sm text-yellow-600">
                                Expire le: {new Date(product.expiryDate).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                            <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                              {Math.ceil(
                                (new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                              )}{" "}
                              jours
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {criticalStockProducts.length === 0 &&
                  lowStockProducts.length === 0 &&
                  expiringProducts.length === 0 && (
                    <Card className="shadow-lg border-0">
                      <CardContent className="p-12 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-green-700 mb-2">Aucune Alerte</h3>
                        <p className="text-green-600">Tous les stocks sont à niveau optimal</p>
                      </CardContent>
                    </Card>
                  )}
              </div>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Stock Distribution by Category */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Distribution par Catégorie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categories.map((category) => {
                        const categoryProducts = products.filter((p) => p.category === category)
                        const percentage = (categoryProducts.length / totalProducts) * 100
                        return (
                          <div key={category}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{category}</span>
                              <span className="text-sm text-gray-600">{categoryProducts.length} produits</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Stock Value by Supplier */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Valeur par Fournisseur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {suppliers.map((supplier) => {
                        const supplierProducts = products.filter((p) => p.supplier === supplier)
                        const supplierValue = supplierProducts.reduce((sum, p) => sum + p.price * p.stock, 0)
                        const percentage = (supplierValue / totalValue) * 100
                        return (
                          <div key={supplier}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{supplier}</span>
                              <span className="text-sm text-gray-600">€{supplierValue.toLocaleString()}</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Stock Trends */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Tendances Mensuelles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Graphique des tendances de stock</p>
                      <p className="text-sm text-gray-400">Évolution sur les 12 derniers mois</p>
                    </div>
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
