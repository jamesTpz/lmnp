import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { renderToStream } from '@react-pdf/renderer'
import { RentalContract } from '@/lib/pdf/rental-contract'

export async function GET(
  request: NextRequest,
  { params }: { params: { reservationId: string } }
) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Fetch reservation with all required data
    const reservation = await prisma.reservation.findFirst({
      where: {
        id: params.reservationId,
        mobileHome: {
          ownerId: session.userId,
        },
      },
      include: {
        mobileHome: {
          include: {
            owner: true,
          },
        },
        tenant: true,
      },
    })

    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      )
    }

    // Generate PDF
    const pdfStream = await renderToStream(
      RentalContract({
        reservation: {
          id: reservation.id,
          checkInDate: reservation.checkInDate,
          checkOutDate: reservation.checkOutDate,
          numberOfGuests: reservation.numberOfGuests,
          totalPrice: reservation.totalPrice,
          depositAmount: reservation.depositAmount,
        },
        tenant: {
          firstName: reservation.tenant.firstName,
          lastName: reservation.tenant.lastName,
          email: reservation.tenant.email,
          phone: reservation.tenant.phone,
          address: reservation.tenant.address || undefined,
        },
        mobileHome: {
          name: reservation.mobileHome.name,
          location: reservation.mobileHome.location,
          capacity: reservation.mobileHome.capacity,
          bedrooms: reservation.mobileHome.bedrooms,
          bathrooms: reservation.mobileHome.bathrooms,
        },
        owner: {
          firstName: reservation.mobileHome.owner.firstName || undefined,
          lastName: reservation.mobileHome.owner.lastName || undefined,
          email: reservation.mobileHome.owner.email,
        },
      })
    )

    // Convert stream to buffer
    const chunks: Buffer[] = []
    for await (const chunk of pdfStream as any) {
      chunks.push(Buffer.from(chunk))
    }
    const buffer = Buffer.concat(chunks)

    // Return PDF
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="contrat-${reservation.id.slice(0, 8)}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating contract PDF:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du contrat' },
      { status: 500 }
    )
  }
}
