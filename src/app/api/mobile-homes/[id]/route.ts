import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET a single mobile home
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const mobileHome = await prisma.mobileHome.findFirst({
      where: {
        id: params.id,
        ownerId: session.userId,
      },
      include: {
        reservations: {
          include: {
            tenant: true,
          },
          orderBy: {
            checkInDate: 'desc',
          },
        },
        tasks: {
          orderBy: {
            dueDate: 'asc',
          },
        },
        inventory: true,
      },
    })

    if (!mobileHome) {
      return NextResponse.json(
        { error: 'Mobile home non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ mobileHome })
  } catch (error) {
    console.error('Error fetching mobile home:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du mobile home' },
      { status: 500 }
    )
  }
}

// PATCH update a mobile home
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Verify ownership
    const existingMobileHome = await prisma.mobileHome.findFirst({
      where: {
        id: params.id,
        ownerId: session.userId,
      },
    })

    if (!existingMobileHome) {
      return NextResponse.json(
        { error: 'Mobile home non trouvé' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const updates: any = {}

    if (body.name) updates.name = body.name
    if (body.description !== undefined) updates.description = body.description
    if (body.location) updates.location = body.location
    if (body.capacity) updates.capacity = body.capacity
    if (body.bedrooms) updates.bedrooms = body.bedrooms
    if (body.bathrooms) updates.bathrooms = body.bathrooms
    if (body.amenities !== undefined) updates.amenities = body.amenities
    if (body.photos !== undefined) updates.photos = body.photos
    if (body.basePrice !== undefined) updates.basePrice = body.basePrice

    const mobileHome = await prisma.mobileHome.update({
      where: { id: params.id },
      data: updates,
    })

    return NextResponse.json({ mobileHome })
  } catch (error) {
    console.error('Error updating mobile home:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du mobile home' },
      { status: 500 }
    )
  }
}

// DELETE a mobile home
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Verify ownership and check for reservations
    const mobileHome = await prisma.mobileHome.findFirst({
      where: {
        id: params.id,
        ownerId: session.userId,
      },
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    })

    if (!mobileHome) {
      return NextResponse.json(
        { error: 'Mobile home non trouvé' },
        { status: 404 }
      )
    }

    if (mobileHome._count.reservations > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un mobile home avec des réservations existantes' },
        { status: 400 }
      )
    }

    await prisma.mobileHome.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting mobile home:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du mobile home' },
      { status: 500 }
    )
  }
}
