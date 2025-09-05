"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Bell,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  Search,
  MessageSquare,
  HelpCircle,
  Zap,
  TrendingUp,
  Shield,
  Database,
  ShoppingCart,
  Package2,
  Euro,
  FileTextIcon,
  Truck,
  Microscope,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  const getRoleDashboard = () => {
    switch (user?.role) {
      case "client":
        return { name: "Dashboard Client", href: "/", icon: LayoutDashboard, color: "text-blue-600" }
      case "fournisseur":
        return { name: "Dashboard Fournisseur", href: "/", icon: LayoutDashboard, color: "text-green-600" }
      case "admin":
        return { name: "Dashboard Admin", href: "/", icon: LayoutDashboard, color: "text-purple-600" }
      default:
        return { name: "Dashboard", href: "/", icon: LayoutDashboard, color: "text-gray-600" }
    }
  }

  const dashboard = getRoleDashboard()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast({
        title: "Recherche",
        description: `Recherche pour "${searchQuery}" en cours...`,
      })
    }
  }

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "3 nouvelles notifications disponibles.",
    })
  }

  const handleMessagesClick = () => {
    toast({
      title: "Messages",
      description: "2 nouveaux messages reçus.",
    })
  }

  const handleHelpClick = () => {
    toast({
      title: "Aide",
      description: "Centre d'aide ouvert.",
    })
  }

  const getNavigationItems = () => {
    const baseItems = [{ name: "Accueil", href: "/", icon: LayoutDashboard }]

    switch (user?.role) {
      case "client":
        return [
          ...baseItems,
          { name: "Commandes", href: "/client", icon: ShoppingCart },
          { name: "Documents", href: "/documents", icon: FileTextIcon },
        ]
      case "fournisseur":
        return [
          ...baseItems,
          { name: "Fournisseur", href: "/fournisseur", icon: Database },
          { name: "Inventaire", href: "/inventory", icon: Package2 },
          { name: "Logistique", href: "/logistics", icon: Truck },
          { name: "Qualité", href: "/quality", icon: Microscope },
          { name: "Documents", href: "/documents", icon: FileTextIcon },
        ]
      case "admin":
        return [
          ...baseItems,
          { name: "Administration", href: "/admin", icon: Shield },
          { name: "Inventaire", href: "/inventory", icon: Package2 },
          { name: "Finance", href: "/finance", icon: Euro },
          { name: "Conformité", href: "/compliance", icon: Shield },
          { name: "Logistique", href: "/logistics", icon: Truck },
          { name: "Qualité", href: "/quality", icon: Microscope },
          { name: "Documents", href: "/documents", icon: FileTextIcon },
        ]
      default:
        return baseItems
    }
  }

  return (
    <header className="bg-white shadow-lg border-b sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Database className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PharmaDistrib
              </h1>
              <p className="text-xs text-gray-500 font-medium">Distribution Intelligente</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Rechercher produits, commandes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              />
            </form>
          </div>

          {/* Dashboard Link */}
          <div className="hidden md:flex">
            <Link
              href={dashboard.href}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200",
                pathname === dashboard.href
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-md"
                  : "text-gray-700 hover:bg-gray-50 hover:text-blue-600",
              )}
            >
              <dashboard.icon className={cn("w-5 h-5", dashboard.color)} />
              <span>{dashboard.name}</span>
              {pathname === dashboard.href && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {user && (
              <>
                {/* Quick Actions */}
                <div className="hidden lg:flex items-center space-x-1">
                  <Button variant="ghost" size="sm" onClick={handleMessagesClick} className="relative">
                    <MessageSquare className="w-5 h-5" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-blue-500">
                      2
                    </Badge>
                  </Button>

                  <Button variant="ghost" size="sm" onClick={handleNotificationClick} className="relative">
                    <Bell className="w-5 h-5" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500">
                      3
                    </Badge>
                  </Button>

                  <Button variant="ghost" size="sm" onClick={handleHelpClick}>
                    <HelpCircle className="w-5 h-5" />
                  </Button>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="hidden sm:block text-left">
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs px-2 py-0",
                                user.role === "admin" && "border-purple-200 text-purple-700 bg-purple-50",
                                user.role === "client" && "border-blue-200 text-blue-700 bg-blue-50",
                                user.role === "fournisseur" && "border-green-200 text-green-700 bg-green-50",
                              )}
                            >
                              {user.role === "admin" ? "Admin" : user.role === "client" ? "Client" : "Fournisseur"}
                            </Badge>
                            <Zap className="w-3 h-3 text-yellow-500" />
                          </div>
                        </div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 p-2">
                    <DropdownMenuLabel className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.pharmacyName && <p className="text-xs text-gray-400">{user.pharmacyName}</p>}
                          {user.companyName && <p className="text-xs text-gray-400">{user.companyName}</p>}
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-50 rounded-lg">
                      <User className="mr-3 h-4 w-4" />
                      <div>
                        <p className="font-medium">Mon Profil</p>
                        <p className="text-xs text-gray-500">Gérer vos informations</p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-50 rounded-lg">
                      <Settings className="mr-3 h-4 w-4" />
                      <div>
                        <p className="font-medium">Paramètres</p>
                        <p className="text-xs text-gray-500">Préférences et configuration</p>
                      </div>
                    </DropdownMenuItem>

                    {user.role === "admin" && (
                      <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-50 rounded-lg">
                        <Shield className="mr-3 h-4 w-4" />
                        <div>
                          <p className="font-medium">Administration</p>
                          <p className="text-xs text-gray-500">Gestion système</p>
                        </div>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-50 rounded-lg">
                      <TrendingUp className="mr-3 h-4 w-4" />
                      <div>
                        <p className="font-medium">Statistiques</p>
                        <p className="text-xs text-gray-500">Vos performances</p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="p-3 cursor-pointer hover:bg-red-50 rounded-lg text-red-600"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <div>
                        <p className="font-medium">Déconnexion</p>
                        <p className="text-xs text-red-400">Se déconnecter du compte</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t bg-white/95 backdrop-blur-md">
            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 border-0"
                />
              </form>
            </div>

            {/* Mobile Dashboard Link */}
            <Link
              href={dashboard.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 mb-2",
                pathname === dashboard.href
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50",
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <dashboard.icon className={cn("w-5 h-5", dashboard.color)} />
              <span>{dashboard.name}</span>
            </Link>

            {/* Navigation Items */}
            <div className="space-y-2">
              {getNavigationItems().map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                    pathname === item.href
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Quick Actions */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={handleMessagesClick} className="relative bg-transparent">
                <MessageSquare className="w-4 h-4 mr-2" />
                Messages
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs">
                  2
                </Badge>
              </Button>
              <Button variant="outline" size="sm" onClick={handleNotificationClick} className="relative bg-transparent">
                <Bell className="w-4 h-4 mr-2" />
                Alertes
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
              <Button variant="outline" size="sm" onClick={handleHelpClick}>
                <HelpCircle className="w-4 h-4 mr-2" />
                Aide
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
