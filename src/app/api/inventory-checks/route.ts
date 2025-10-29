import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET inventory checks
export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mobileHomeId = searchParams.get('mobileHomeId')
    const reservationId = searchParams.get('reservationId')

    if (!mobileHomeId && !reservationId) {
      return NextResponse.json(
        { error: 'mobileHomeId ou reservationId est requis' },
        { status: 400 }
      )
    }

    const whereClause: any = {}

    if (reservationId) {
      // Verify reservation ownership through mobile home
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

      whereClause.reservationId = reservationId
    } else if (mobileHomeId) {
      // Verify mobile home ownership
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

      whereClause.mobileHomeId = mobileHomeId
    }

    const inventoryChecks = await prisma.inventoryCheck.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            inventoryItem: true,
          },
        },
        reservation: {
          include: {
            tenant: true,
          },
        },
      },
      orderBy: {
        performedAt: 'desc',
      },
    })

    return NextResponse.json({ inventoryChecks })
  } catch (error) {
    console.error('Error fetching inventory checks:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des états des lieux' },
      { status: 500 }
    )
  }
}

// POST create a new inventory check
export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const {
      mobileHomeId,
      reservationId,
      checkType,
      performedBy,
      notes,
      items // Array of { inventoryItemId, condition, notes, photos }
    } = body

    // Validate required fields
    if (!mobileHomeId || !checkType || !performedBy || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Les champs mobileHomeId, checkType, performedBy et items sont requis' },
        { status: 400 }
      )
    }

    // Verify mobile home ownership
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

    // Verify reservation if provided
    if (reservationId) {
      const reservation = await prisma.reservation.findFirst({
        where: {
          id: reservationId,
          mobileHomeId,
        },
      })

      if (!reservation) {
        return NextResponse.json(
          { error: 'Réservation non trouvée pour ce mobile home' },
          { status: 404 }
        )
      }
    }

    // Create inventory check with items
    const inventoryCheck = await prisma.inventoryCheck.create({
      data: {
        mobileHomeId,
        reservationId: reservationId || null,
        checkType,
        performedBy,
        performedAt: new Date(),
        notes,
        items: {
          create: items.map((item: any) => ({
            inventoryItemId: item.inventoryItemId,
            name: item.name,
            condition: item.condition,
            notes: item.notes,
            photos: item.photos,
          })),
        },
      },
      include: {
        items: {
          include: {
            inventoryItem: true,
          },
        },
        reservation: {
          include: {
            tenant: true,
          },
        },
      },
    })

    return NextResponse.json({ inventoryCheck }, { status: 201 })
  } catch (error) {
    console.error('Error creating inventory check:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'état des lieux' },
      { status: 500 }
    )
  }
}
