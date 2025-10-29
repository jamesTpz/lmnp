import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all inventory items for a mobile home
export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mobileHomeId = searchParams.get('mobileHomeId')

    if (!mobileHomeId) {
      return NextResponse.json(
        { error: 'mobileHomeId est requis' },
        { status: 400 }
      )
    }

    // Verify ownership
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

    const inventoryItems = await prisma.inventoryItem.findMany({
      where: {
        mobileHomeId,
      },
      orderBy: {
        category: 'asc',
      },
    })

    return NextResponse.json({ inventoryItems })
  } catch (error) {
    console.error('Error fetching inventory items:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des articles' },
      { status: 500 }
    )
  }
}

// POST create a new inventory item
export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { mobileHomeId, name, category, quantity, condition, photos } = body

    // Validate required fields
    if (!mobileHomeId || !name || !category || quantity === undefined) {
      return NextResponse.json(
        { error: 'Les champs mobileHomeId, name, category et quantity sont requis' },
        { status: 400 }
      )
    }

    // Verify ownership
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

    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        mobileHomeId,
        name,
        category,
        quantity: parseInt(quantity),
        condition,
        photos,
        lastChecked: new Date(),
      },
    })

    return NextResponse.json({ inventoryItem }, { status: 201 })
  } catch (error) {
    console.error('Error creating inventory item:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'article' },
      { status: 500 }
    )
  }
}
