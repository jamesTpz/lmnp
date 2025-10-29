import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET a single inventory check
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const inventoryCheck = await prisma.inventoryCheck.findFirst({
      where: {
        id: params.id,
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
            mobileHome: true,
          },
        },
      },
    })

    if (!inventoryCheck) {
      return NextResponse.json(
        { error: 'État des lieux non trouvé' },
        { status: 404 }
      )
    }

    // Verify ownership through reservation
    if (inventoryCheck.reservation) {
      const mobileHome = await prisma.mobileHome.findFirst({
        where: {
          id: inventoryCheck.reservation.mobileHomeId,
          ownerId: session.userId,
        },
      })

      if (!mobileHome) {
        return NextResponse.json(
          { error: 'Non autorisé' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({ inventoryCheck })
  } catch (error) {
    console.error('Error fetching inventory check:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'état des lieux' },
      { status: 500 }
    )
  }
}

// PATCH update an inventory check
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
    const existingCheck = await prisma.inventoryCheck.findFirst({
      where: {
        id: params.id,
      },
      include: {
        reservation: {
          include: {
            mobileHome: true,
          },
        },
      },
    })

    if (!existingCheck) {
      return NextResponse.json(
        { error: 'État des lieux non trouvé' },
        { status: 404 }
      )
    }

    if (existingCheck.reservation) {
      const mobileHome = await prisma.mobileHome.findFirst({
        where: {
          id: existingCheck.reservation.mobileHomeId,
          ownerId: session.userId,
        },
      })

      if (!mobileHome) {
        return NextResponse.json(
          { error: 'Non autorisé' },
          { status: 403 }
        )
      }
    }

    const body = await request.json()
    const { notes, signatureUrl } = body

    const inventoryCheck = await prisma.inventoryCheck.update({
      where: { id: params.id },
      data: {
        ...(notes !== undefined && { notes }),
        ...(signatureUrl !== undefined && { signatureUrl }),
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

    return NextResponse.json({ inventoryCheck })
  } catch (error) {
    console.error('Error updating inventory check:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'état des lieux' },
      { status: 500 }
    )
  }
}

// DELETE an inventory check
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Verify ownership
    const existingCheck = await prisma.inventoryCheck.findFirst({
      where: {
        id: params.id,
      },
      include: {
        reservation: {
          include: {
            mobileHome: true,
          },
        },
      },
    })

    if (!existingCheck) {
      return NextResponse.json(
        { error: 'État des lieux non trouvé' },
        { status: 404 }
      )
    }

    if (existingCheck.reservation) {
      const mobileHome = await prisma.mobileHome.findFirst({
        where: {
          id: existingCheck.reservation.mobileHomeId,
          ownerId: session.userId,
        },
      })

      if (!mobileHome) {
        return NextResponse.json(
          { error: 'Non autorisé' },
          { status: 403 }
        )
      }
    }

    await prisma.inventoryCheck.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting inventory check:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'état des lieux' },
      { status: 500 }
    )
  }
}
