import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET a single tenant
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
      include: {
        reservations: {
          include: {
            mobileHome: true,
          },
          orderBy: {
            checkInDate: 'desc',
          },
        },
      },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Locataire non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json({ tenant })
  } catch (error) {
    console.error('Error fetching tenant:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du locataire' },
      { status: 500 }
    )
  }
}

// PATCH update a tenant
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const updates: any = {}

    // Only update provided fields
    if (body.firstName) updates.firstName = body.firstName
    if (body.lastName) updates.lastName = body.lastName
    if (body.email) updates.email = body.email
    if (body.phone) updates.phone = body.phone
    if (body.address !== undefined) updates.address = body.address
    if (body.city !== undefined) updates.city = body.city
    if (body.postalCode !== undefined) updates.postalCode = body.postalCode
    if (body.country !== undefined) updates.country = body.country
    if (body.emergencyContact !== undefined) updates.emergencyContact = body.emergencyContact
    if (body.emergencyPhone !== undefined) updates.emergencyPhone = body.emergencyPhone
    if (body.notes !== undefined) updates.notes = body.notes

    const tenant = await prisma.tenant.update({
      where: { id: params.id },
      data: updates,
    })

    return NextResponse.json({ tenant })
  } catch (error) {
    console.error('Error updating tenant:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du locataire' },
      { status: 500 }
    )
  }
}

// DELETE a tenant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Check if tenant has reservations
    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    })

    if (!tenant) {
      return NextResponse.json(
        { error: 'Locataire non trouvé' },
        { status: 404 }
      )
    }

    if (tenant._count.reservations > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un locataire avec des réservations existantes' },
        { status: 400 }
      )
    }

    await prisma.tenant.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tenant:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du locataire' },
      { status: 500 }
    )
  }
}
