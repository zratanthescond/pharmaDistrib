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
import { ExportButton } from "@/components/export/export-button"
import {
  Truck,
  MapPin,
  Clock,
  Route,
  Users,
  Search,
  Plus,
  Eye,
  NavigationIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function LogisticsPage() {
  const { user } = useAuth()
  const { orders } = useDataStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Mock logistics data
  const deliveries = orders.map((order, index) => ({
    id: `DEL-${String(index + 1).padStart(4, "0")}`,
    orderId: order.id,
    clientName: order.clientName,
    address: `${Math.floor(Math.random() * 999) + 1} Rue de la Pharmacie, ${["Paris", "Lyon", "Marseille", "Toulouse", "Nice"][Math.floor(Math.random() * 5)]}`,
    status: ["pending", "in-transit", "delivered", "delayed"][Math.floor(Math.random() * 4)],
    driver: ["Jean Dupont", "Marie Martin", "Pierre Durand", "Sophie Leroy"][Math.floor(Math.random() * 4)],
    vehicle: `VH-${String(Math.floor(Math.random() * 99) + 1).padStart(2, "0")}`,
    scheduledDate: order.orderDate,
    estimatedTime: `${Math.floor(Math.random() * 4) + 1}h${Math.floor(Math.random() * 6)}0min`,
    distance: `${Math.floor(Math.random() * 50) + 5}km`,
    priority: ["normal", "urgent", "critical"][Math.floor(Math.random() * 3)],
  }))

  const drivers = [
    {
      id: "DRV-001",
      name: "Jean Dupont",
      status: "available",
      currentLocation: "Entrepôt Central",
      deliveriesToday: 8,
      rating: 4.8,
      vehicle: "VH-01",
    },
    {
      id: "DRV-002",
      name: "Marie Martin",
      status: "in-transit",
      currentLocation: "En route vers Paris 15e",
      deliveriesToday: 6,
      rating: 4.9,
      vehicle: "VH-02",
    },
    {
      id: "DRV-003",
      name: "Pierre Durand",
      status: "break",
      currentLocation: "Pause déjeuner",
      deliveriesToday: 5,
      rating: 4.7,
      vehicle: "VH-03",
    },
  ]

  const routes = [
    {
      id: "RT-001",
      name: "Route Paris Nord",
      driver: "Jean Dupont",
      deliveries: 8,
      status: "active",
      progress: 62,
      estimatedCompletion: "16:30",
      distance: "45km",
    },
    {
      id: "RT-002",
      name: "Route Lyon Centre",
      driver: "Marie Martin",
      deliveries: 6,
      status: "active",
      progress: 83,
      estimatedCompletion: "17:15",
      distance: "32km",
    },
    {
      id: "RT-003",
      name: "Route Marseille Sud",
      driver: "Pierre Durand",
      deliveries: 5,
      status: "pending",
      progress: 0,
      estimatedCompletion: "18:00",
      distance: "28km",
    },
  ]

  // Calculate logistics metrics
  const pendingDeliveries = deliveries.filter((d) => d.status === "pending").length
  const inTransitDeliveries = deliveries.filter((d) => d.status === "in-transit").length
  const completedDeliveries = deliveries.filter((d) => d.status === "delivered").length
  const delayedDeliveries = deliveries.filter((d) => d.status === "delayed").length
  const onTimeRate =
    completedDeliveries > 0 ? ((completedDeliveries - delayedDeliveries) / completedDeliveries) * 100 : 100

  // Filter deliveries
  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || delivery.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in-transit":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "delayed":
        return "bg-red-100 text-red-800"
      case "available":
        return "bg-green-100 text-green-800"
      case "break":
        return "bg-orange-100 text-orange-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Livré"
      case "in-transit":
        return "En transit"
      case "pending":
        return "En attente"
      case "delayed":
        return "Retardé"
      case "available":
        return "Disponible"
      case "break":
        return "En pause"
      case "active":
        return "Actif"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "urgent":
        return "bg-orange-500"
      case "normal":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleScheduleDelivery = () => {
    toast({
      title: "Livraison planifiée",
      description: "Nouvelle livraison ajoutée au planning",
    })
  }

  const handleOptimizeRoute = () => {
    toast({
      title: "Route optimisée",
      description: "Itinéraire recalculé pour une efficacité maximale",
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
                  <Truck className="w-8 h-8 text-blue-600" />
                  <span>Logistique & Livraisons</span>
                </h1>
                <p className="text-gray-600">Gestion des livraisons et optimisation des routes</p>
              </div>
              <div className="flex items-center space-x-4">
                <ExportButton data={filteredDeliveries} filename="livraisons" />
                <Button onClick={handleScheduleDelivery}>
                  <Plus className="w-4 h-4 mr-2" />
                  Planifier livraison
                </Button>
              </div>
            </div>
          </div>

          {/* Logistics KPIs */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">En Transit</p>
                    <p className="text-3xl font-bold text-blue-900">{inTransitDeliveries}</p>
                    <p className="text-xs text-blue-600 mt-1">Livraisons actives</p>
                  </div>
                  <Truck className="w-12 h-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Livrées</p>
                    <p className="text-3xl font-bold text-green-900">{completedDeliveries}</p>
                    <p className="text-xs text-green-600 mt-1">Aujourd'hui</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">En Attente</p>
                    <p className="text-3xl font-bold text-yellow-900">{pendingDeliveries}</p>
                    <p className="text-xs text-yellow-600 mt-1">À planifier</p>
                  </div>
                  <Clock className="w-12 h-12 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Taux Ponctualité</p>
                    <p className="text-3xl font-bold text-purple-900">{onTimeRate.toFixed(0)}%</p>
                    <p className="text-xs text-purple-600 mt-1">Performance</p>
                  </div>
                  <NavigationIcon className="w-12 h-12 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="deliveries" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="deliveries">Livraisons</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
              <TabsTrigger value="drivers">Chauffeurs</TabsTrigger>
              <TabsTrigger value="tracking">Suivi</TabsTrigger>
            </TabsList>

            {/* Deliveries Tab */}
            <TabsContent value="deliveries" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher une livraison..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="in-transit">En transit</SelectItem>
                        <SelectItem value="delivered">Livrées</SelectItem>
                        <SelectItem value="delayed">Retardées</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleOptimizeRoute} variant="outline">
                      <Route className="w-4 h-4 mr-2" />
                      Optimiser routes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Deliveries List */}
              <Card>
                <CardHeader>
                  <CardTitle>Liste des Livraisons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredDeliveries.map((delivery) => (
                      <div key={delivery.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">
                                {delivery.id.slice(-2)}
                              </div>
                              <div
                                className={`absolute -top-1 -right-1 w-4 h-4 ${getPriorityColor(delivery.priority)} rounded-full`}
                              ></div>
                            </div>
                            <div>
                              <h4 className="font-semibold">{delivery.id}</h4>
                              <p className="text-sm text-gray-600">{delivery.clientName}</p>
                              <p className="text-xs text-gray-500 flex items-center mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {delivery.address}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <Badge className={getStatusColor(delivery.status)}>
                                {getStatusText(delivery.status)}
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                {delivery.driver} • {delivery.vehicle}
                              </p>
                              <p className="text-xs text-gray-500">
                                {delivery.distance} • {delivery.estimatedTime}
                              </p>
                            </div>

                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <MapPin className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Routes Tab */}
            <TabsContent value="routes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Routes Actives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {routes.map((route) => (
                      <div key={route.id} className="border rounded-lg p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-2">{route.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Chauffeur: {route.driver}</span>
                              <span>{route.deliveries} livraisons</span>
                              <span>{route.distance}</span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(route.status)}>{getStatusText(route.status)}</Badge>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Progression</span>
                            <span className="text-sm font-medium">{route.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${route.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Fin estimée: {route.estimatedCompletion}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <MapPin className="w-4 h-4 mr-2" />
                              Voir carte
                            </Button>
                            <Button size="sm" variant="outline">
                              <Route className="w-4 h-4 mr-2" />
                              Optimiser
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Drivers Tab */}
            <TabsContent value="drivers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Équipe de Chauffeurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {drivers.map((driver) => (
                      <Card key={driver.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {driver.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <h3 className="font-semibold">{driver.name}</h3>
                              <p className="text-sm text-gray-600">{driver.vehicle}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Statut</span>
                              <Badge className={getStatusColor(driver.status)}>{getStatusText(driver.status)}</Badge>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Position</span>
                              <span className="text-sm font-medium">{driver.currentLocation}</span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Livraisons aujourd'hui</span>
                              <span className="text-sm font-medium">{driver.deliveriesToday}</span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Note</span>
                              <div className="flex items-center space-x-1">
                                <span className="text-sm font-medium">{driver.rating}</span>
                                <span className="text-yellow-500">★</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-2 mt-4">
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              <MapPin className="w-4 h-4 mr-2" />
                              Localiser
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              <Users className="w-4 h-4 mr-2" />
                              Contacter
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tracking Tab */}
            <TabsContent value="tracking" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Suivi en Temps Réel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Carte de suivi GPS</p>
                        <p className="text-sm text-gray-400">Positions en temps réel</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alertes et Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-sm font-medium">Retard détecté</p>
                          <p className="text-xs text-gray-600">DEL-0023 - Embouteillages sur A6</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Livraison terminée</p>
                          <p className="text-xs text-gray-600">DEL-0019 - Pharmacie Centrale</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Truck className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Départ entrepôt</p>
                          <p className="text-xs text-gray-600">DEL-0025 - Route Paris Nord</p>
                        </div>
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
