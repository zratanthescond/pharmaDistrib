import { type NextRequest, NextResponse } from "next/server"

// Mock Stripe functionality for development
const mockStripe = {
  paymentIntents: {
    create: async (params: any) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        id: `pi_mock_${Date.now()}`,
        client_secret: `pi_mock_${Date.now()}_secret_mock`,
        amount: params.amount,
        currency: params.currency,
        status: "requires_payment_method",
        metadata: params.metadata,
      }
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount, currency = "eur", customerId, description, metadata } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 })
    }

    if (!orderId) {
      return NextResponse.json({ error: "ID de commande requis" }, { status: 400 })
    }

    // Use mock Stripe for development (replace with real Stripe in production)
    const paymentIntent = await mockStripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description: description || `Commande pharmaceutique ${orderId}`,
      metadata: {
        orderId,
        customerId: customerId || "",
        platform: "PharmaDistrib",
        ...metadata,
      },
    })

    return NextResponse.json({
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ error: "Erreur lors de la création du paiement" }, { status: 500 })
  }
}
