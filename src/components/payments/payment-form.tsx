'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  reservationId?: string
  amount: number
  description: string
  type?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

function PaymentFormContent({ reservationId, amount, description, type, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: submitError } = await elements.submit()

      if (submitError) {
        setError(submitError.message || 'Erreur lors de la soumission')
        setLoading(false)
        return
      }

      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId,
          amount,
          description,
          type,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du paiement')
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret: data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      })

      if (confirmError) {
        setError(confirmError.message || 'Erreur lors de la confirmation du paiement')
        onError?.(confirmError.message || 'Erreur lors de la confirmation')
        setLoading(false)
      } else {
        onSuccess?.()
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du paiement')
      onError?.(err.message || 'Erreur lors du paiement')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        <div className="bg-muted p-4 rounded-md">
          <p className="text-sm text-muted-foreground mb-1">Montant à payer</p>
          <p className="text-2xl font-bold text-foreground">{amount.toFixed(2)} €</p>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>

        <PaymentElement />

        <Button type="submit" className="w-full" disabled={!stripe || loading}>
          {loading ? 'Traitement...' : `Payer ${amount.toFixed(2)} €`}
        </Button>
      </CardContent>
    </form>
  )
}

export function PaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle>Paiement sécurisé</CardTitle>
        <CardDescription>
          Paiement traité de manière sécurisée via Stripe
        </CardDescription>
      </CardHeader>
      {stripePromise && (
        <Elements
          stripe={stripePromise}
          options={{
            mode: 'payment',
            amount: Math.round(props.amount * 100),
            currency: 'eur',
          }}
        >
          <PaymentFormContent {...props} />
        </Elements>
      )}
    </Card>
  )
}
