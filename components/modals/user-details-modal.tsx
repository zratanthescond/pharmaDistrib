"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, User, Mail, Building2, Calendar, Shield } from "lucide-react"
import type { User as UserType } from "@/lib/auth"

interface UserDetailsModalProps {
  user: UserType
  isOpen: boolean
  onClose: () => void
}

export function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Détails utilisateur</span>
              </CardTitle>
              <CardDescription>Informations complètes de l'utilisateur</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations personnelles</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              {user.pharmacyName && (
                <div className="flex items-center space-x-3">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Pharmacie</p>
                    <p className="font-medium">{user.pharmacyName}</p>
                  </div>
                </div>
              )}
              {user.companyName && (
                <div className="flex items-center space-x-3">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Entreprise</p>
                    <p className="font-medium">{user.companyName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Role & Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rôle et statut</h3>
            <div className="flex flex-wrap gap-4">
              <Badge variant={user.role === "admin" ? "default" : user.role === "client" ? "secondary" : "outline"}>
                {user.role}
              </Badge>
              <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
            </div>
          </div>

          <Separator />

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Permissions</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.permissions.map((permission, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {permission}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Activity */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Activité</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Créé le</p>
                <p className="font-medium">{user.createdAt}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dernière connexion</p>
                <p className="font-medium">{user.lastLogin || "Jamais"}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button>Modifier</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
