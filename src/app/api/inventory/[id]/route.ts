import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET a single inventory item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const inventoryItem = await prisma.inventoryItem.findFirst({
      where: {
        id: params.id,
        mobileHome: {
          ownerId: session.userId,
        },
      },
      include: {
        mobileHome: true,
      },
    })

    if (!inventoryItem) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ inventoryItem })
  } catch (error) {
    console.error('Error fetching inventory item:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'article' },
      { status: 500 }
    )
  }
}

// PATCH update an inventory item
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
    const existingItem = await prisma.inventoryItem.findFirst({
      where: {
        id: params.id,
        mobileHome: {
          ownerId: session.userId,
        },
      },
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { name, category, quantity, condition, photos } = body

    const inventoryItem = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(category && { category }),
        ...(quantity !== undefined && { quantity: parseInt(quantity) }),
        ...(condition && { condition }),
        ...(photos !== undefined && { photos }),
        lastChecked: new Date(),
      },
    })

    return NextResponse.json({ inventoryItem })
  } catch (error) {
    console.error('Error updating inventory item:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'article' },
      { status: 500 }
    )
  }
}

// DELETE an inventory item
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
    const existingItem = await prisma.inventoryItem.findFirst({
      where: {
        id: params.id,
        mobileHome: {
          ownerId: session.userId,
        },
      },
      include: {
        _count: {
          select: {
            checkItems: true,
          },
        },
      },
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    // Check if item has been used in inventory checks
    if (existingItem._count.checkItems > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un article qui a été utilisé dans des états des lieux' },
        { status: 400 }
      )
    }

    await prisma.inventoryItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting inventory item:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'article' },
      { status: 500 }
    )
  }
}
