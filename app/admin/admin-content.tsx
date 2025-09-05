"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/contexts/auth-context"
import { mockUsers } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Shield, FileText, Settings, Eye, Download, Lock, UserPlus, Edit, Search, RefreshCw } from "lucide-react"

export default function AdminModuleContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserType, setSelectedUserType] = useState("all")
  const { user } = useAuth()

  const filteredUsers = mockUsers.filter(
    (u) =>
      (selectedUserType === "all" || u.role.toLowerCase() === selectedUserType) &&
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Back-Office Administratif</h1>
              <p className="text-gray-600">Bienvenue {user?.name} - Administration centralisée</p>
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
                  <Button>
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
                                variant={u.role === "admin" ? "default" : u.role === "client" ? "secondary" : "outline"}
                              >
                                {u.role}
                              </Badge>
                              <Badge variant={u.status === "active" ? "default" : "destructive"}>{u.status}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{u.email}</p>
                            {u.pharmacyName && <p className="text-sm text-gray-600">{u.pharmacyName}</p>}
                            {u.companyName && <p className="text-sm text-gray-600">{u.companyName}</p>}
                            <p className="text-xs text-gray-500 mt-1">Dernière connexion: {u.lastLogin || "Jamais"}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {u.permissions.map((permission, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
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

          {/* Other tabs content */}
          <TabsContent value="supervision" className="space-y-6">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Supervision</h2>
              <p className="text-gray-600">Module de supervision en cours de développement...</p>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Rapports</h2>
              <p className="text-gray-600">Module de rapports en cours de développement...</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Paramétrage</h2>
              <p className="text-gray-600">Module de paramétrage en cours de développement...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
