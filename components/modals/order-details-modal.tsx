"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface OrderDetailsModalProps {
  order: any
  isOpen: boolean
  onClose: () => void
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!order) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "shipped":
        return "secondary"
      case "confirmed":
        return "outline"
      case "pending":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "confirmed":
        return "Confirmée"
      case "shipped":
        return "Expédiée"
      case "delivered":
        return "Livrée"
      case "cancelled":
        return "Annulée"
      default:
        return status
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails de la commande {order.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Informations générales</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Client:</span> {order.clientName}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {new Date(order.orderDate).toLocaleDateString("fr-FR")}
                </p>
                {order.deliveryDate && (
                  <p>
                    <span className="font-medium">Livraison:</span>{" "}
                    {new Date(order.deliveryDate).toLocaleDateString("fr-FR")}
                  </p>
                )}
                <p>
                  <span className="font-medium">Statut:</span>{" "}
                  <Badge variant={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Résumé</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Nombre d'articles:</span> {order.products?.length || 0}
                </p>
                <p>
                  <span className="font-medium">Total:</span>{" "}
                  <span className="text-lg font-bold text-blue-600">€{order.total.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-4">Produits commandés</h3>
            <div className="space-y-3">
              {order.products?.map((product: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{product.productName}</h4>
                        <p className="text-sm text-gray-600">Quantité: {product.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">€{product.price.toFixed(2)} / unité</p>
                        <p className="text-sm text-gray-600">Total: €{(product.price * product.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || <p className="text-gray-500 text-center py-4">Aucun produit trouvé</p>}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{order.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
