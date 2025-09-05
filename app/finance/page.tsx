"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useDataStore } from "@/lib/data-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  FileText,
  TrendingUp,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Calculator,
  PieChart,
  BarChart3,
  Download,
  Eye,
  Send,
  RefreshCw,
  Filter,
  Search,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ExportButton } from "@/components/export/export-button"

export default function FinancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState("month")

  const { orders, users } = useDataStore()
  const { toast } = useToast()

  // Generate invoices from orders
  const invoices = orders.map((order, index) => ({
    id: `INV-${String(index + 1).padStart(4, "0")}`,
    orderId: order.id,
    clientName: order.clientName,
    amount: order.total,
    tax: order.total * 0.2, // 20% VAT
    totalAmount: order.total * 1.2,
    status: Math.random() > 0.3 ? "paid" : Math.random() > 0.5 ? "pending" : "overdue",
    issueDate: order.orderDate,
    dueDate: new Date(new Date(order.orderDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    paymentDate:
      Math.random() > 0.4
        ? new Date(new Date(order.orderDate).getTime() + Math.random() * 25 * 24 * 60 * 60 * 1000).toISOString()
        : null,
  }))

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate financial metrics
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const paidInvoices = invoices.filter((inv) => inv.status === "paid")
  const pendingInvoices = invoices.filter((inv) => inv.status === "pending")
  const overdueInvoices = invoices.filter((inv) => inv.status === "overdue")

  const paidAmount = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)

  const monthlyRevenue = invoices
    .filter((inv) => new Date(inv.issueDate).getMonth() === new Date().getMonth())
    .reduce((sum, inv) => sum + inv.totalAmount, 0)

  const previousMonthRevenue = invoices
    .filter((inv) => new Date(inv.issueDate).getMonth() === new Date().getMonth() - 1)
    .reduce((sum, inv) => sum + inv.totalAmount, 0)

  const revenueGrowth =
    previousMonthRevenue > 0 ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 : 0

  // Payment methods distribution
  const paymentMethods = [
    { method: "Virement bancaire", count: Math.floor(paidInvoices.length * 0.6), color: "bg-blue-500" },
    { method: "Carte de crédit", count: Math.floor(paidInvoices.length * 0.25), color: "bg-green-500" },
    { method: "Chèque", count: Math.floor(paidInvoices.length * 0.1), color: "bg-purple-500" },
    { method: "Espèces", count: Math.floor(paidInvoices.length * 0.05), color: "bg-orange-500" },
  ]

  const handleGenerateInvoice = (orderId: string) => {
    toast({
      title: "Facture générée",
      description: `Facture créée pour la commande ${orderId}`,
    })
  }

  const handleSendInvoice = (invoiceId: string) => {
    toast({
      title: "Facture envoyée",
      description: `Facture ${invoiceId} envoyée par email`,
    })
  }

  const handleMarkAsPaid = (invoiceId: string) => {
    toast({
      title: "Paiement enregistré",
      description: `Facture ${invoiceId} marquée comme payée`,
    })
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "fournisseur"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Gestion Financière
                </h1>
                <p className="text-gray-600 text-lg">Facturation, paiements et analyses financières</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="border-green-200 hover:bg-green-50 bg-transparent">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
                <ExportButton
                  data={filteredInvoices.map((inv) => ({
                    "N° Facture": inv.id,
                    Client: inv.clientName,
                    Montant: inv.amount,
                    TVA: inv.tax,
                    "Total TTC": inv.totalAmount,
                    Statut: inv.status,
                    "Date émission": new Date(inv.issueDate).toLocaleDateString("fr-FR"),
                    "Date échéance": new Date(inv.dueDate).toLocaleDateString("fr-FR"),
                  }))}
                  filename="factures"
                />
              </div>
            </div>

            {/* Financial KPIs */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100">Chiffre d'Affaires</p>
                      <p className="text-3xl font-bold">€{(totalRevenue / 1000).toFixed(0)}K</p>
                    </div>
                    <DollarSign className="w-12 h-12 text-green-200" />
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm text-green-100">+{revenueGrowth.toFixed(1)}% ce mois</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100">Factures Payées</p>
                      <p className="text-3xl font-bold">{paidInvoices.length}</p>
                    </div>
                    <CheckCircle className="w-12 h-12 text-blue-200" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-blue-100">€{(paidAmount / 1000).toFixed(0)}K encaissés</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100">En Attente</p>
                      <p className="text-3xl font-bold">{pendingInvoices.length}</p>
                    </div>
                    <Clock className="w-12 h-12 text-yellow-200" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-yellow-100">€{(pendingAmount / 1000).toFixed(0)}K à encaisser</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100">En Retard</p>
                      <p className="text-3xl font-bold">{overdueInvoices.length}</p>
                    </div>
                    <AlertCircle className="w-12 h-12 text-red-200" />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-red-100">€{(overdueAmount / 1000).toFixed(0)}K en retard</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="invoices" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
              <TabsTrigger value="invoices" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Factures</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Paiements</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Rapports</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <PieChart className="w-4 h-4" />
                <span>Analyses</span>
              </TabsTrigger>
            </TabsList>

            {/* Invoices Management */}
            <TabsContent value="invoices" className="space-y-6">
              {/* Filters */}
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher une facture..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="paid">Payées</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="overdue">En retard</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Cette semaine</SelectItem>
                        <SelectItem value="month">Ce mois</SelectItem>
                        <SelectItem value="quarter">Ce trimestre</SelectItem>
                        <SelectItem value="year">Cette année</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" className="border-green-200 hover:bg-green-50 bg-transparent">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtres avancés
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Invoices List */}
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <Card key={invoice.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-semibold">{invoice.id}</h3>
                            <Badge
                              variant={
                                invoice.status === "paid"
                                  ? "default"
                                  : invoice.status === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {invoice.status === "paid"
                                ? "Payée"
                                : invoice.status === "pending"
                                  ? "En attente"
                                  : "En retard"}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Client</p>
                              <p className="font-medium">{invoice.clientName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Date d'émission</p>
                              <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString("fr-FR")}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Date d'échéance</p>
                              <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString("fr-FR")}</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Montant HT</p>
                              <p className="font-medium">€{invoice.amount.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">TVA (20%)</p>
                              <p className="font-medium">€{invoice.tax.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Total TTC</p>
                              <p className="text-xl font-bold text-green-600">€{invoice.totalAmount.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="ml-6 space-y-2">
                          <Button size="sm" variant="outline" className="w-full bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => handleSendInvoice(invoice.id)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Envoyer
                          </Button>
                          {invoice.status !== "paid" && (
                            <Button
                              size="sm"
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={() => handleMarkAsPaid(invoice.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Marquer payée
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="w-full bg-transparent">
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredInvoices.length === 0 && (
                <Card className="shadow-lg border-0">
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Aucune facture trouvée</p>
                    <p className="text-gray-400">Modifiez vos critères de recherche</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Payments Tracking */}
            <TabsContent value="payments" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Payment Methods */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <span>Méthodes de Paiement</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paymentMethods.map((method, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${method.color}`}></div>
                            <span className="font-medium">{method.method}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">{method.count}</span>
                            <span className="text-sm text-gray-500 ml-1">
                              ({((method.count / paidInvoices.length) * 100).toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Payments */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Paiements Récents</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {paidInvoices.slice(0, 5).map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div>
                            <h4 className="font-semibold">{invoice.id}</h4>
                            <p className="text-sm text-gray-600">{invoice.clientName}</p>
                            <p className="text-xs text-green-600">
                              {invoice.paymentDate && new Date(invoice.paymentDate).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-700">€{invoice.totalAmount.toFixed(2)}</p>
                            <Badge variant="default" className="text-xs">
                              Payée
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Overdue Payments Alert */}
              {overdueInvoices.length > 0 && (
                <Card className="shadow-lg border-0 border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      <span>Paiements en Retard - Action Requise</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {overdueInvoices.map((invoice) => (
                        <div
                          key={invoice.id}
                          className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200"
                        >
                          <div>
                            <h4 className="font-semibold text-red-800">{invoice.id}</h4>
                            <p className="text-sm text-red-600">{invoice.clientName}</p>
                            <p className="text-xs text-red-500">
                              Échéance: {new Date(invoice.dueDate).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-red-700">€{invoice.totalAmount.toFixed(2)}</p>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 mt-1">
                              Relancer
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Financial Reports */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Monthly Revenue Chart */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Graphique des revenus mensuels</p>
                        <p className="text-sm text-gray-400">Évolution sur 12 mois</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Status Distribution */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Répartition des Paiements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Graphique en secteurs</p>
                        <p className="text-sm text-gray-400">Statuts des factures</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Summary */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Résumé Financier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-700">Revenus Totaux</h3>
                      <p className="text-3xl font-bold text-green-600">€{(totalRevenue / 1000).toFixed(0)}K</p>
                      <p className="text-sm text-green-500">+{revenueGrowth.toFixed(1)}% vs mois précédent</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-700">Taux de Recouvrement</h3>
                      <p className="text-3xl font-bold text-blue-600">
                        {((paidInvoices.length / invoices.length) * 100).toFixed(0)}%
                      </p>
                      <p className="text-sm text-blue-500">
                        {paidInvoices.length} sur {invoices.length} factures
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-700">Délai Moyen de Paiement</h3>
                      <p className="text-3xl font-bold text-purple-600">18j</p>
                      <p className="text-sm text-purple-500">Objectif: 15 jours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Client Revenue Analysis */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Top Clients par Revenus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users
                        .filter((u) => u.role === "client")
                        .slice(0, 5)
                        .map((client, index) => {
                          const clientInvoices = invoices.filter((inv) => inv.clientName === client.pharmacyName)
                          const clientRevenue = clientInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
                          return (
                            <div key={client.id} className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="font-medium">{client.pharmacyName}</p>
                                  <p className="text-sm text-gray-600">{clientInvoices.length} factures</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">€{(clientRevenue / 1000).toFixed(1)}K</p>
                                <p className="text-sm text-gray-500">
                                  {((clientRevenue / totalRevenue) * 100).toFixed(1)}%
                                </p>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </CardContent>
                </Card>

                {/* Cash Flow Forecast */}
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle>Prévisions de Trésorerie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">Encaissements prévus (30j)</span>
                        <span className="font-semibold text-green-600">€{(pendingAmount / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Revenus récurrents</span>
                        <span className="font-semibold text-blue-600">
                          €{((monthlyRevenue * 0.7) / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium">Croissance projetée</span>
                        <span className="font-semibold text-purple-600">+{(revenueGrowth + 2).toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Indicators */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Indicateurs de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="font-semibold">Panier Moyen</h4>
                      <p className="text-2xl font-bold text-blue-600">€{(totalRevenue / invoices.length).toFixed(0)}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h4 className="font-semibold">Croissance</h4>
                      <p className="text-2xl font-bold text-green-600">+{revenueGrowth.toFixed(1)}%</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <h4 className="font-semibold">DSO</h4>
                      <p className="text-2xl font-bold text-orange-600">18j</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="font-semibold">Taux de Recouvrement</h4>
                      <p className="text-2xl font-bold text-purple-600">
                        {((paidInvoices.length / invoices.length) * 100).toFixed(0)}%
                      </p>
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
