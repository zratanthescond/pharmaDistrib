"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard, Lock } from "lucide-react"

interface CheckoutFormProps {
  amount: number
  orderId: string
  onSuccess: () => void
  onError: (error: string) => void
}

export function CheckoutForm({ amount, orderId, onSuccess, onError }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create payment intent
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          orderId,
          currency: "eur",
        }),
      })

      const { clientSecret, error } = await response.json()

      if (error) {
        onError(error)
        return
      }

      // Simulate successful payment for demo
      setTimeout(() => {
        onSuccess()
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      onError("Une erreur est survenue lors du paiement")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Paiement sécurisé</span>
        </CardTitle>
        <CardDescription>
          Montant à payer: <span className="font-semibold">{amount.toFixed(2)}€</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardName">Nom sur la carte</Label>
            <Input
              id="cardName"
              value={cardDetails.name}
              onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Jean Dupont"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Numéro de carte</Label>
            <Input
              id="cardNumber"
              value={cardDetails.number}
              onChange={(e) => setCardDetails((prev) => ({ ...prev, number: e.target.value }))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiration</Label>
              <Input
                id="expiry"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))}
                placeholder="MM/AA"
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                value={cardDetails.cvc}
                onChange={(e) => setCardDetails((prev) => ({ ...prev, cvc: e.target.value }))}
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>

          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>Vos informations de paiement sont sécurisées et chiffrées.</AlertDescription>
          </Alert>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              `Payer ${amount.toFixed(2)}€`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
