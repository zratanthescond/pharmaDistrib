export interface PaymentData {
  orderId: string
  amount: number
  currency: string
  customerId: string
  description: string
  metadata?: Record<string, string>
}

export interface PaymentResult {
  success: boolean
  paymentIntentId?: string
  clientSecret?: string
  error?: string
}

export const createPaymentIntent = async (paymentData: PaymentData): Promise<PaymentResult> => {
  try {
    const response = await fetch("/api/payments/create-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        error: errorData.error || "Erreur lors de la création du paiement",
      }
    }

    const result = await response.json()

    return {
      success: true,
      paymentIntentId: result.paymentIntentId,
      clientSecret: result.clientSecret,
    }
  } catch (error) {
    console.error("Payment service error:", error)
    return {
      success: false,
      error: "Erreur de connexion au service de paiement",
    }
  }
}

export const confirmPayment = async (paymentIntentId: string): Promise<PaymentResult> => {
  try {
    const response = await fetch("/api/payments/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentIntentId }),
    })

    const result = await response.json()

    return {
      success: response.ok && result.success,
      error: response.ok && result.success ? undefined : result.error || "Erreur lors de la confirmation",
    }
  } catch (error) {
    console.error("Payment confirmation error:", error)
    return {
      success: false,
      error: "Erreur lors de la confirmation du paiement",
    }
  }
}
