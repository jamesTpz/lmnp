import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET a single reservation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const reservation = await prisma.reservation.findFirst({
      where: {
        id: params.id,
        mobileHome: {
          ownerId: session.userId,
        },
      },
      include: {
        mobileHome: true,
        tenant: true,
        depositDeductions: true,
        tasks: true,
      },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({ reservation })
  } catch (error) {
    console.error('Error fetching reservation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la réservation' },
      { status: 500 }
    )
  }
}

// PATCH update a reservation
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Verify ownership
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        id: params.id,
        mobileHome: {
          ownerId: session.userId,
        },
      },
    })

    if (!existingReservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const updates: any = {}

    // Only update provided fields
    if (body.checkInDate) updates.checkInDate = new Date(body.checkInDate)
    if (body.checkOutDate) updates.checkOutDate = new Date(body.checkOutDate)
    if (body.numberOfGuests) updates.numberOfGuests = body.numberOfGuests
    if (body.totalPrice !== undefined) updates.totalPrice = body.totalPrice
    if (body.platformFee !== undefined) updates.platformFee = body.platformFee
    if (body.netRevenue !== undefined) updates.netRevenue = body.netRevenue
    if (body.status) updates.status = body.status
    if (body.depositStatus) updates.depositStatus = body.depositStatus
    if (body.notes !== undefined) updates.notes = body.notes

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: updates,
      include: {
        mobileHome: true,
        tenant: true,
      },
    })

    return NextResponse.json({ reservation })
  } catch (error) {
    console.error('Error updating reservation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la réservation' },
      { status: 500 }
    )
  }
}

// DELETE a reservation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Verify ownership
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: params.id,
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

    await prisma.reservation.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting reservation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la réservation' },
      { status: 500 }
    )
  }
}
