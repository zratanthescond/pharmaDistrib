"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useDataStore } from "@/lib/data-store"
import { useToast } from "@/hooks/use-toast"

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "client" as "admin" | "client" | "fournisseur",
    pharmacyName: "",
    companyName: "",
    address: "",
    phone: "",
  })

  const addUser = useDataStore((state) => state.addUser)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newUser = {
      ...formData,
      status: "active" as const,
      lastLogin: new Date().toISOString(),
      permissions:
        formData.role === "admin"
          ? ["all"]
          : formData.role === "client"
            ? ["orders", "invoices"]
            : ["stocks", "orders", "analytics"],
    }

    addUser(newUser)

    toast({
      title: "Utilisateur créé",
      description: `${formData.name} a été ajouté avec succès.`,
    })

    setFormData({
      name: "",
      email: "",
      role: "client",
      pharmacyName: "",
      companyName: "",
      address: "",
      phone: "",
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Rôle</Label>
            <Select
              value={formData.role}
              onValueChange={(value: any) => setFormData((prev) => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="fournisseur">Fournisseur</SelectItem>
                <SelectItem value="admin">Administrateur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.role === "client" && (
            <div>
              <Label htmlFor="pharmacyName">Nom de la pharmacie</Label>
              <Input
                id="pharmacyName"
                value={formData.pharmacyName}
                onChange={(e) => setFormData((prev) => ({ ...prev, pharmacyName: e.target.value }))}
              />
            </div>
          )}

          {formData.role === "fournisseur" && (
            <div>
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
              />
            </div>
          )}

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Créer l'utilisateur</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
