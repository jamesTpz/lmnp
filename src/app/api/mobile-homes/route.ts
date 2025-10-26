import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all mobile homes for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const mobileHomes = await prisma.mobileHome.findMany({
      where: {
        ownerId: session.userId,
      },
      include: {
        _count: {
          select: {
            reservations: true,
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ mobileHomes })
  } catch (error) {
    console.error('Error fetching mobile homes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des mobile homes' },
      { status: 500 }
    )
  }
}

// POST create a new mobile home
export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      location,
      capacity,
      bedrooms,
      bathrooms,
      amenities,
      photos,
      basePrice,
    } = body

    const mobileHome = await prisma.mobileHome.create({
      data: {
        name,
        description,
        location,
        capacity,
        bedrooms,
        bathrooms,
        amenities: amenities || [],
        photos: photos || [],
        basePrice,
        ownerId: session.userId,
      },
    })

    return NextResponse.json({ mobileHome }, { status: 201 })
  } catch (error) {
    console.error('Error creating mobile home:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du mobile home' },
      { status: 500 }
    )
  }
}
