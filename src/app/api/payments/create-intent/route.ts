import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { stripe, STRIPE_CURRENCY } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { reservationId, amount, description, type } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      )
    }

    // Verify reservation belongs to user
    if (reservationId) {
      const reservation = await prisma.reservation.findFirst({
        where: {
          id: reservationId,
          mobileHome: {
            ownerId: session.userId,
          },
        },
      })

      if (!reservation) {
        return NextResponse.json(
          { error: 'Réservation non trouvée' },
          { status: 404 }
        )
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: STRIPE_CURRENCY,
      description: description || 'Paiement LMNP-Serenity',
      metadata: {
        userId: session.userId,
        reservationId: reservationId || '',
        type: type || 'deposit',
      },
    })

    // Create payment record in database
    await prisma.payment.create({
      data: {
        amount,
        currency: STRIPE_CURRENCY.toUpperCase(),
        status: 'PENDING',
        stripePaymentId: paymentIntent.id,
        metadata: {
          userId: session.userId,
          reservationId: reservationId || '',
          type: type || 'deposit',
        },
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    )
  }
}
