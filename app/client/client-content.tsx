"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ShoppingCart,
  Search,
  Package,
  FileText,
  TrendingUp,
  Plus,
  Minus,
  Eye,
  RefreshCw,
  CreditCard,
} from "lucide-react"
import { useDataStore } from "@/lib/data-store"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { OrderDetailsModal } from "@/components/modals/order-details-modal"

export default function ClientModuleContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()
  const { products, cart, orders, addToCart, removeFromCart, updateCartQuantity, clearCart, addOrder } = useDataStore()

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get user orders
  const userOrders = orders.filter((order) => order.clientName === user?.pharmacyName)

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId)
    return total + (product ? product.price * item.quantity : 0)
  }, 0)

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1)
    const product = products.find((p) => p.id === productId)
    toast({
      title: "Produit ajouté",
      description: `${product?.name} ajouté au panier`,
    })
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      updateCartQuantity(productId, quantity)
    }
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits avant de passer commande",
      })
      return
    }

    const orderProducts = cart.map((item) => {
      const product = products.find((p) => p.id === item.productId)
      return {
        productId: item.productId,
        productName: product?.name || "",
        quantity: item.quantity,
        price: product?.price || 0,
      }
    })

    const newOrder = {
      clientId: user?.id || "",
      clientName: user?.pharmacyName || user?.name || "",
      products: orderProducts,
      total: cartTotal,
      status: "pending" as const,
      orderDate: new Date().toISOString(),
    }

    addOrder(newOrder)
    clearCart()

    toast({
      title: "Commande passée",
      description: `Commande de €${cartTotal.toFixed(2)} passée avec succès`,
    })
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Module Client</h1>
              <p className="text-gray-600">Interface dédiée aux pharmacies et hôpitaux</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button className="relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Panier ({cart.length})
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="catalog" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="catalog" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Catalogue</span>
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Panier ({cart.length})</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Mes commandes</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Statistiques</span>
            </TabsTrigger>
          </TabsList>

          {/* Catalogue des produits */}
          <TabsContent value="catalog" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Toutes catégories" />
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
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <Badge variant="outline" className="mb-2">
                        {product.category}
                      </Badge>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="text-xs text-gray-500">
                        <p>Fournisseur: {product.supplier}</p>
                        <p>Stock: {product.stock} unités</p>
                        <p>Exp: {new Date(product.expiryDate).toLocaleDateString("fr-FR")}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold text-blue-600">€{product.price.toFixed(2)}</div>
                      <Button size="sm" onClick={() => handleAddToCart(product.id)} disabled={product.stock === 0}>
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>

                    {product.stock <= product.minStock && (
                      <Badge variant="destructive" className="w-full mt-2">
                        Stock faible
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun produit trouvé</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Panier */}
          <TabsContent value="cart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Mon panier</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map((item) => {
                      const product = products.find((p) => p.id === item.productId)
                      if (!product) return null

                      return (
                        <div key={item.productId} className="flex justify-between items-center p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.category}</p>
                            <p className="text-sm font-medium">€{product.price.toFixed(2)} / unité</p>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="text-right min-w-[80px]">
                              <p className="font-semibold">€{(product.price * item.quantity).toFixed(2)}</p>
                            </div>

                            <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.productId)}>
                              ×
                            </Button>
                          </div>
                        </div>
                      )
                    })}

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-blue-600">€{cartTotal.toFixed(2)}</span>
                      </div>

                      <div className="flex space-x-4">
                        <Button variant="outline" onClick={clearCart}>
                          Vider le panier
                        </Button>
                        <Button className="flex-1" onClick={handleCheckout}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Passer commande
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Votre panier est vide</p>
                    <Button className="mt-4" onClick={() => document.querySelector('[value="catalog"]')?.click()}>
                      Parcourir le catalogue
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mes commandes */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Mes commandes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold">{order.id}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(order.orderDate).toLocaleDateString("fr-FR")} à{" "}
                                {new Date(order.orderDate).toLocaleTimeString("fr-FR")}
                              </p>
                              <p className="text-sm text-gray-600">{order.products.length} produit(s)</p>
                              {order.deliveryDate && (
                                <p className="text-sm text-gray-600">
                                  Livraison: {new Date(order.deliveryDate).toLocaleDateString("fr-FR")}
                                </p>
                              )}
                            </div>

                            <div className="text-right">
                              <p className="text-xl font-bold text-blue-600">€{order.total.toFixed(2)}</p>
                              <Badge
                                variant={
                                  order.status === "delivered"
                                    ? "default"
                                    : order.status === "shipped"
                                      ? "secondary"
                                      : order.status === "confirmed"
                                        ? "outline"
                                        : "destructive"
                                }
                              >
                                {order.status === "pending"
                                  ? "En attente"
                                  : order.status === "confirmed"
                                    ? "Confirmée"
                                    : order.status === "shipped"
                                      ? "Expédiée"
                                      : order.status === "delivered"
                                        ? "Livrée"
                                        : "Annulée"}
                              </Badge>
                            </div>

                            <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Détails
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune commande trouvée</p>
                    <Button className="mt-4" onClick={() => document.querySelector('[value="catalog"]')?.click()}>
                      Passer ma première commande
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistiques */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{userOrders.length}</div>
                  <p className="text-sm text-gray-600">Commandes totales</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    €{userOrders.reduce((sum, order) => sum + order.total, 0).toFixed(0)}
                  </div>
                  <p className="text-sm text-gray-600">Total dépensé</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {userOrders.length > 0
                      ? (userOrders.reduce((sum, order) => sum + order.total, 0) / userOrders.length).toFixed(0)
                      : 0}
                    €
                  </div>
                  <p className="text-sm text-gray-600">Panier moyen</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {userOrders.filter((o) => o.status === "delivered").length}
                  </div>
                  <p className="text-sm text-gray-600">Commandes livrées</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Évolution des commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Graphique des commandes par mois</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <OrderDetailsModal order={selectedOrder} isOpen={showOrderDetails} onClose={() => setShowOrderDetails(false)} />
      )}
    </div>
  )
}
