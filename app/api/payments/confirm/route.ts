import { type NextRequest, NextResponse } from "next/server"

// Mock Stripe functionality for development
const mockStripe = {
  paymentIntents: {
    retrieve: async (id: string) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        id,
        status: "succeeded", // Mock successful payment
        amount: 1000,
        currency: "eur",
      }
    },
  },
}

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "ID de paiement requis" }, { status: 400 })
    }

    // Use mock Stripe for development
    const paymentIntent = await mockStripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === "succeeded") {
      return NextResponse.json({
        success: true,
        status: paymentIntent.status,
      })
    }

    return NextResponse.json({
      success: false,
      status: paymentIntent.status,
      error: "Le paiement n'a pas été confirmé",
    })
  } catch (error) {
    console.error("Error confirming payment:", error)
    return NextResponse.json({ error: "Erreur lors de la confirmation du paiement" }, { status: 500 })
  }
}
