"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, CreditCard, Lock, Package, Building2, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { createPaymentIntent, type PaymentData } from "@/lib/payment-service"

const isDevelopment = process.env.NODE_ENV === "development"

interface OrderItem {
  id: string
  name: string
  brand: string
  quantity: number
  price: number
  category: string
}

interface PharmaceuticalCheckoutProps {
  orderId: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
  onCancel: () => void
}

export function PharmaceuticalCheckout({
  orderId,
  items,
  subtotal,
  tax,
  shipping,
  total,
  onSuccess,
  onError,
  onCancel,
}: PharmaceuticalCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const paymentData: PaymentData = {
        orderId,
        amount: total,
        currency: "eur",
        customerId: user?.id || "",
        description: `Commande pharmaceutique ${orderId} - ${user?.pharmacyName || user?.companyName || ""}`,
        metadata: {
          userRole: user?.role || "",
          pharmacyName: user?.pharmacyName || "",
          companyName: user?.companyName || "",
          itemCount: items.length.toString(),
        },
      }

      const result = await createPaymentIntent(paymentData)

      if (result.success && result.paymentIntentId) {
        // Simulate payment processing for demo
        setTimeout(() => {
          onSuccess(result.paymentIntentId!)
          setIsLoading(false)
        }, 2000)
      } else {
        onError(result.error || "Erreur lors du paiement")
        setIsLoading(false)
      }
    } catch (error) {
      onError("Une erreur est survenue lors du paiement")
      setIsLoading(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Récapitulatif de commande</span>
          </CardTitle>
          <CardDescription>Commande #{orderId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Customer Info */}
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <Building2 className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.pharmacyName || user?.companyName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <h4 className="font-medium">Articles commandés</h4>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-start p-3 border rounded-lg">
                <div className="flex-1">
                  <h5 className="font-medium">{item.name}</h5>
                  <p className="text-sm text-gray-600">{item.brand}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {item.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {item.quantity} × {item.price.toFixed(2)}€
                  </p>
                  <p className="text-sm text-gray-600">{(item.quantity * item.price).toFixed(2)}€</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span>TVA</span>
              <span>{tax.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison</span>
              <span>{shipping === 0 ? "Gratuite" : `${shipping.toFixed(2)}€`}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{total.toFixed(2)}€</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Paiement sécurisé</span>
          </CardTitle>
          <CardDescription>Vos informations de paiement sont protégées et chiffrées</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Nom sur la carte</Label>
              <Input
                id="cardName"
                value={cardDetails.name}
                onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Dr. Jean Dupont"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Numéro de carte</Label>
              <Input
                id="cardNumber"
                value={cardDetails.number}
                onChange={(e) => {
                  // Format card number with spaces
                  const value = e.target.value
                    .replace(/\s/g, "")
                    .replace(/(.{4})/g, "$1 ")
                    .trim()
                  if (value.length <= 19) {
                    setCardDetails((prev) => ({ ...prev, number: value }))
                  }
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Date d'expiration</Label>
                <Input
                  id="expiry"
                  value={cardDetails.expiry}
                  onChange={(e) => {
                    // Format expiry date MM/YY
                    const value = e.target.value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2")
                    if (value.length <= 5) {
                      setCardDetails((prev) => ({ ...prev, expiry: value }))
                    }
                  }}
                  placeholder="MM/AA"
                  maxLength={5}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">Code CVC</Label>
                <Input
                  id="cvc"
                  value={cardDetails.cvc}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "")
                    if (value.length <= 4) {
                      setCardDetails((prev) => ({ ...prev, cvc: value }))
                    }
                  }}
                  placeholder="123"
                  maxLength={4}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {isDevelopment && (
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Mode développement:</strong> Utilisez n'importe quelles données de carte pour tester. Le
                  paiement sera simulé.
                </AlertDescription>
              </Alert>
            )}

            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Paiement sécurisé par Stripe. Vos données bancaires sont chiffrées et ne sont jamais stockées sur nos
                serveurs.
              </AlertDescription>
            </Alert>

            <div className="flex space-x-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  `Payer ${total.toFixed(2)}€`
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
