import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all reservations for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        mobileHome: {
          ownerId: session.userId,
        },
      },
      include: {
        mobileHome: true,
        tenant: true,
        depositDeductions: true,
      },
      orderBy: {
        checkInDate: 'desc',
      },
    })

    return NextResponse.json({ reservations })
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    )
  }
}

// POST create a new reservation
export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const {
      mobileHomeId,
      tenantId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      platformFee,
      netRevenue,
      status,
      platform,
      depositAmount,
      depositStatus,
      notes,
    } = body

    // Verify mobile home belongs to user
    const mobileHome = await prisma.mobileHome.findFirst({
      where: {
        id: mobileHomeId,
        ownerId: session.userId,
      },
    })

    if (!mobileHome) {
      return NextResponse.json(
        { error: 'Mobile home non trouvé' },
        { status: 404 }
      )
    }

    const reservation = await prisma.reservation.create({
      data: {
        mobileHomeId,
        tenantId,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        numberOfGuests,
        totalPrice,
        platformFee,
        netRevenue,
        status,
        platform,
        depositAmount,
        depositStatus,
        notes,
      },
      include: {
        mobileHome: true,
        tenant: true,
      },
    })

    return NextResponse.json({ reservation }, { status: 201 })
  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la réservation' },
      { status: 500 }
    )
  }
}
