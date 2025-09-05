"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useDataStore } from "@/lib/data-store"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { ExportButton } from "@/components/export/export-button"
import {
  Users,
  BarChart3,
  Shield,
  Database,
  TrendingUp,
  Package,
  FileText,
  ShoppingCart,
  CheckCircle,
  Zap,
  Target,
  Award,
  Globe,
  Smartphone,
  AlertTriangle,
  Activity,
  Clock,
  DollarSign,
  Truck,
  Star,
  UserCheck,
  Heart,
  Pill,
  Stethoscope,
  Building2,
  Factory,
  Warehouse,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { prepareOrdersForExport } from "@/lib/export-utils"

// CLIENT DASHBOARD - Focus on purchasing, inventory needs, and healthcare operations
function ClientDashboard() {
  const { user } = useAuth()
  const { products, orders, cart } = useDataStore()
  const { toast } = useToast()

  const userOrders = orders.filter((order) => order.clientName === user?.pharmacyName)
  const recentOrders = userOrders.slice(0, 3)
  const cartTotal = cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId)
    return total + (product ? product.price * item.quantity : 0)
  }, 0)

  const monthlySpending = userOrders
    .filter((order) => new Date(order.orderDate).getMonth() === new Date().getMonth())
    .reduce((sum, order) => sum + order.total, 0)

  const urgentNeeds = products.filter((p) => p.stock <= 10).slice(0, 5)
  const deliveriesToday = userOrders.filter(
    (o) => o.deliveryDate && new Date(o.deliveryDate).toDateString() === new Date().toDateString(),
  )

  const clientMetrics = [
    {
      title: "Budget mensuel",
      value: `€${monthlySpending.toFixed(0)}`,
      subtitle: "sur €5,000",
      progress: (monthlySpending / 5000) * 100,
      icon: CreditCard,
      color: "bg-blue-500",
      trend: "+12%",
    },
    {
      title: "Commandes actives",
      value: userOrders.filter((o) => o.status !== "delivered").length,
      subtitle: "en cours",
      progress: 75,
      icon: Package,
      color: "bg-green-500",
      trend: "+3",
    },
    {
      title: "Livraisons aujourd'hui",
      value: deliveriesToday.length,
      subtitle: "attendues",
      progress: 60,
      icon: Truck,
      color: "bg-purple-500",
      trend: "2 en route",
    },
    {
      title: "Produits critiques",
      value: urgentNeeds.length,
      subtitle: "stock faible",
      progress: 90,
      icon: AlertTriangle,
      color: "bg-red-500",
      trend: "Action requise",
    },
  ]

  const quickActions = [
    {
      title: "Commande urgente",
      description: "Produits critiques",
      icon: Zap,
      href: "/client",
      color: "bg-red-500",
      urgent: true,
      count: urgentNeeds.length,
    },
    {
      title: "Catalogue complet",
      description: "Parcourir tous les produits",
      icon: Pill,
      href: "/client",
      color: "bg-blue-500",
      count: products.length,
    },
    {
      title: "Mes prescriptions",
      description: "Commandes récurrentes",
      icon: Stethoscope,
      href: "/client",
      color: "bg-green-500",
      count: 12,
    },
    {
      title: "Support patient",
      description: "Assistance médicale",
      icon: Heart,
      href: "/client",
      color: "bg-pink-500",
      count: 0,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Healthcare-focused Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-700 text-white p-8 rounded-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Espace Pharmacie</h1>
              <p className="text-blue-100 text-lg">{user?.pharmacyName}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="bg-white/20 text-white border-white/30">Pharmacie Agréée</Badge>
                <Badge className="bg-green-500/20 text-green-100 border-green-400/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Certifiée
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {clientMetrics.map((metric, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="w-6 h-6 text-white" />
                  <span className="text-xs text-blue-200">{metric.trend}</span>
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-blue-100">{metric.title}</div>
                <div className="text-xs text-blue-200 mt-1">{metric.subtitle}</div>
                <Progress value={metric.progress} className="mt-2 h-1 bg-white/20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Healthcare Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card
              className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-lg ${action.urgent ? "ring-2 ring-red-200 animate-pulse" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  {action.count > 0 && (
                    <Badge
                      className={`${action.urgent ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"} group-hover:bg-gray-200`}
                    >
                      {action.count}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
                {action.urgent && (
                  <Badge variant="destructive" className="mt-2 text-xs">
                    Urgent
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Critical Stock Alerts */}
      <Card className="shadow-lg border-0 border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span>Alertes Stock Critique</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {urgentNeeds.length > 0 ? (
            <div className="space-y-3">
              {urgentNeeds.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200"
                >
                  <div>
                    <h4 className="font-semibold text-red-800">{product.name}</h4>
                    <p className="text-sm text-red-600">Stock: {product.stock} unités</p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Commander maintenant
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-green-600">✅ Tous les stocks sont à niveau optimal</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders with Healthcare Context */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Commandes Récentes</span>
            </CardTitle>
            <ExportButton data={prepareOrdersForExport(userOrders)} size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold">
                      <Pill className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Commande #{order.id.slice(-6)}</h4>
                      <p className="text-sm text-gray-600">{new Date(order.orderDate).toLocaleDateString("fr-FR")}</p>
                      <p className="text-xs text-blue-600">{order.products?.length || 0} médicaments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">€{order.total.toFixed(2)}</p>
                    <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                      {order.status === "pending"
                        ? "En préparation"
                        : order.status === "confirmed"
                          ? "Confirmée"
                          : order.status === "shipped"
                            ? "En livraison"
                            : "Livrée"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucune commande récente</p>
              <Button className="mt-4" onClick={() => (window.location.href = "/client")}>
                Passer ma première commande
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// SUPPLIER DASHBOARD - Focus on sales, inventory management, and business operations
function SupplierDashboard() {
  const { user } = useAuth()
  const { products, orders } = useDataStore()

  const supplierProducts = products.filter((p) => p.supplier === user?.companyName)
  const supplierOrders = orders.filter((o) =>
    o.products.some((p) => supplierProducts.find((sp) => sp.id === p.productId)),
  )

  const lowStockProducts = supplierProducts.filter((p) => p.stock <= p.minStock)
  const totalRevenue = supplierOrders.reduce((sum, order) => sum + order.total, 0)
  const monthlyRevenue = supplierOrders
    .filter((o) => new Date(o.orderDate).getMonth() === new Date().getMonth())
    .reduce((sum, order) => sum + order.total, 0)

  const topProducts = supplierProducts.sort((a, b) => b.stock - a.stock).slice(0, 5)

  const businessMetrics = [
    {
      title: "Chiffre d'affaires",
      value: `€${(monthlyRevenue / 1000).toFixed(0)}K`,
      subtitle: "ce mois",
      progress: 78,
      icon: DollarSign,
      color: "bg-green-500",
      trend: "+23%",
    },
    {
      title: "Commandes traitées",
      value: supplierOrders.length,
      subtitle: "total",
      progress: 85,
      icon: Package,
      color: "bg-blue-500",
      trend: "+15",
    },
    {
      title: "Produits en stock",
      value: supplierProducts.length,
      subtitle: "références",
      progress: 92,
      icon: Warehouse,
      color: "bg-purple-500",
      trend: "Optimal",
    },
    {
      title: "Alertes stock",
      value: lowStockProducts.length,
      subtitle: "à réapprovisionner",
      progress: lowStockProducts.length > 0 ? 100 : 0,
      icon: AlertTriangle,
      color: "bg-orange-500",
      trend: "Action requise",
    },
  ]

  const businessActions = [
    {
      title: "Gestion des stocks",
      description: "Réapprovisionnement",
      icon: Warehouse,
      href: "/inventory",
      color: "bg-blue-500",
      count: lowStockProducts.length,
      urgent: lowStockProducts.length > 0,
    },
    {
      title: "Commandes clients",
      description: "Traitement en cours",
      icon: ShoppingCart,
      href: "/fournisseur",
      color: "bg-green-500",
      count: supplierOrders.filter((o) => o.status === "pending").length,
    },
    {
      title: "Production",
      description: "Planification",
      icon: Factory,
      href: "/fournisseur",
      color: "bg-purple-500",
      count: 8,
    },
    {
      title: "Analyses de vente",
      description: "Performance produits",
      icon: TrendingUp,
      href: "/fournisseur",
      color: "bg-orange-500",
      count: 0,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Business-focused Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 text-white p-8 rounded-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Factory className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Centre de Distribution</h1>
              <p className="text-green-100 text-lg">{user?.companyName}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="bg-white/20 text-white border-white/30">Fournisseur Certifié</Badge>
                <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30">
                  <Award className="w-3 h-3 mr-1" />
                  Partenaire Premium
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {businessMetrics.map((metric, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="w-6 h-6 text-white" />
                  <span className="text-xs text-green-200">{metric.trend}</span>
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-green-100">{metric.title}</div>
                <div className="text-xs text-green-200 mt-1">{metric.subtitle}</div>
                <Progress value={metric.progress} className="mt-2 h-1 bg-white/20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Operations Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {businessActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card
              className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-lg ${action.urgent ? "ring-2 ring-orange-200" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  {action.count > 0 && (
                    <Badge
                      className={`${action.urgent ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"} group-hover:bg-gray-200`}
                    >
                      {action.count}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
                {action.urgent && (
                  <Badge variant="destructive" className="mt-2 text-xs">
                    Attention requise
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Top Performing Products */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-green-600" />
            <span>Produits Performants</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <p className="text-xs text-green-600">Stock: {product.stock} unités</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg text-green-700">€{product.price.toFixed(2)}</p>
                  <Badge variant="outline" className="text-xs">
                    {product.stock > product.minStock ? "En stock" : "Stock faible"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Analytics */}
      <AnalyticsDashboard
        data={{
          orders: supplierOrders,
          products: supplierProducts,
          users: [],
          revenue: totalRevenue,
          growth: 23.5,
        }}
      />
    </div>
  )
}

// ADMIN DASHBOARD - Focus on system oversight, compliance, and platform management
function AdminDashboard() {
  const { user } = useAuth()
  const { users, orders, products } = useDataStore()

  const activeUsers = users.filter((u) => u.status === "active")
  const pendingOrders = orders.filter((o) => o.status === "pending")
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const criticalAlerts = products.filter((p) => p.stock <= 5).length

  const systemMetrics = [
    {
      title: "Utilisateurs actifs",
      value: activeUsers.length,
      subtitle: `sur ${users.length} total`,
      progress: (activeUsers.length / users.length) * 100,
      icon: Users,
      color: "bg-blue-500",
      trend: "+5 cette semaine",
    },
    {
      title: "Revenus plateforme",
      value: `€${(totalRevenue / 1000).toFixed(0)}K`,
      subtitle: "commission incluse",
      progress: 85,
      icon: DollarSign,
      color: "bg-green-500",
      trend: "+18.5%",
    },
    {
      title: "Alertes système",
      value: criticalAlerts,
      subtitle: "nécessitent attention",
      progress: criticalAlerts > 0 ? 100 : 0,
      icon: AlertTriangle,
      color: "bg-red-500",
      trend: "Critique",
    },
    {
      title: "Conformité",
      value: "98.5%",
      subtitle: "score global",
      progress: 98.5,
      icon: Shield,
      color: "bg-purple-500",
      trend: "Excellent",
    },
  ]

  const adminActions = [
    {
      title: "Gestion utilisateurs",
      description: "Comptes et permissions",
      icon: UserCheck,
      href: "/admin",
      color: "bg-blue-500",
      count: users.length,
    },
    {
      title: "Surveillance système",
      description: "Monitoring en temps réel",
      icon: Activity,
      href: "/admin",
      color: "bg-green-500",
      count: 0,
    },
    {
      title: "Conformité réglementaire",
      description: "Audits et certifications",
      icon: Shield,
      href: "/compliance",
      color: "bg-purple-500",
      count: 3,
    },
    {
      title: "Rapports exécutifs",
      description: "Analytics avancées",
      icon: BarChart3,
      href: "/admin",
      color: "bg-orange-500",
      count: 0,
    },
  ]

  const systemHealth = [
    { metric: "Disponibilité", value: "99.9%", status: "excellent", icon: Globe, color: "text-green-600" },
    { metric: "Temps de réponse", value: "120ms", status: "bon", icon: Zap, color: "text-blue-600" },
    { metric: "Sessions actives", value: "1,247", status: "normal", icon: Users, color: "text-purple-600" },
    { metric: "Appels API", value: "45.2K", status: "normal", icon: Smartphone, color: "text-orange-600" },
  ]

  const recentActivities = [
    { action: "Nouvel utilisateur inscrit", user: "Pharmacie Central", time: "Il y a 5 min", type: "user" },
    { action: "Commande importante", user: "Hôpital Saint-Louis", time: "Il y a 12 min", type: "order" },
    { action: "Alerte stock critique", user: "Système", time: "Il y a 18 min", type: "alert" },
    { action: "Mise à jour conformité", user: "Admin", time: "Il y a 1h", type: "compliance" },
  ]

  return (
    <div className="space-y-8">
      {/* System Administration Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 text-white p-8 rounded-2xl shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Centre de Contrôle</h1>
              <p className="text-purple-100 text-lg">Administration Système</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className="bg-white/20 text-white border-white/30">Super Administrateur</Badge>
                <Badge className="bg-red-500/20 text-red-100 border-red-400/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Accès Total
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {systemMetrics.map((metric, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="w-6 h-6 text-white" />
                  <span className="text-xs text-purple-200">{metric.trend}</span>
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-purple-100">{metric.title}</div>
                <div className="text-xs text-purple-200 mt-1">{metric.subtitle}</div>
                <Progress value={metric.progress} className="mt-2 h-1 bg-white/20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Administrative Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  {action.count > 0 && (
                    <Badge className="bg-gray-100 text-gray-700 group-hover:bg-gray-200">{action.count}</Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* System Health Dashboard */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <span>État du Système</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {systemHealth.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <Badge variant={item.status === "excellent" ? "default" : "secondary"}>{item.status}</Badge>
                </div>
                <p className="text-sm text-gray-600">{item.metric}</p>
                <p className="text-xl font-bold">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent System Activities */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span>Activité Récente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "user"
                      ? "bg-blue-100"
                      : activity.type === "order"
                        ? "bg-green-100"
                        : activity.type === "alert"
                          ? "bg-red-100"
                          : "bg-purple-100"
                  }`}
                >
                  {activity.type === "user" && <Users className="w-5 h-5 text-blue-600" />}
                  {activity.type === "order" && <Package className="w-5 h-5 text-green-600" />}
                  {activity.type === "alert" && <AlertTriangle className="w-5 h-5 text-red-600" />}
                  {activity.type === "compliance" && <Shield className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Analytics */}
      <AnalyticsDashboard
        data={{
          orders,
          products,
          users,
          revenue: totalRevenue,
          growth: 18.5,
        }}
      />
    </div>
  )
}

export default function HomePage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const handleRequestDemo = () => {
    toast({
      title: "Demande de démo",
      description: "Votre demande de démonstration a été envoyée. Nous vous contacterons sous 24h.",
    })
  }

  const handleDownloadBrochure = () => {
    toast({
      title: "Téléchargement en cours",
      description: "La brochure est en cours de téléchargement...",
    })
    setTimeout(() => {
      toast({
        title: "Téléchargement terminé",
        description: "Brochure téléchargée avec succès.",
      })
    }, 2000)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Role-based Dashboard */}
          {user?.role === "client" && <ClientDashboard />}
          {user?.role === "fournisseur" && <SupplierDashboard />}
          {user?.role === "admin" && <AdminDashboard />}

          {/* Default content for users without specific roles */}
          {!user?.role && (
            <div className="text-center py-20">
              <div className="max-w-3xl mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Database className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                  Bienvenue sur PharmaDistrib
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Votre solution complète pour la distribution pharmaceutique intelligente
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <Button
                    onClick={handleRequestDemo}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Demander une démo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadBrochure}
                    size="lg"
                    className="border-2 border-gray-300 hover:border-blue-500 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 bg-transparent"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Télécharger la brochure
                  </Button>
                </div>

                {/* Feature highlights */}
                <div className="grid md:grid-cols-3 gap-8 mt-16">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Automatisation intelligente</h3>
                    <p className="text-gray-600">Gestion automatisée des stocks et commandes</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Sécurité maximale</h3>
                    <p className="text-gray-600">Conformité réglementaire et traçabilité complète</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Analytics avancées</h3>
                    <p className="text-gray-600">Tableaux de bord et rapports en temps réel</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
