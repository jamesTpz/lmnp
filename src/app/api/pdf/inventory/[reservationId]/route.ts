import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { renderToStream } from '@react-pdf/renderer'
import { InventoryForm } from '@/lib/pdf/inventory-form'

export async function GET(
  request: NextRequest,
  { params }: { params: { reservationId: string } }
) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Get check type from query params
    const searchParams = request.nextUrl.searchParams
    const checkType = searchParams.get('type') as 'CHECK_IN' | 'CHECK_OUT' || 'CHECK_IN'

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
            inventory: true,
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
      InventoryForm({
        mobileHome: {
          name: reservation.mobileHome.name,
          location: reservation.mobileHome.location,
        },
        reservation: {
          id: reservation.id,
          checkInDate: reservation.checkInDate,
          checkOutDate: reservation.checkOutDate,
        },
        tenant: {
          firstName: reservation.tenant.firstName,
          lastName: reservation.tenant.lastName,
        },
        items: reservation.mobileHome.inventory.map(item => ({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          condition: item.condition || undefined,
        })),
        checkType,
      })
    )

    // Convert stream to buffer
    const chunks: Buffer[] = []
    for await (const chunk of pdfStream as any) {
      chunks.push(Buffer.from(chunk))
    }
    const buffer = Buffer.concat(chunks)

    const filename = checkType === 'CHECK_IN'
      ? `etat-lieux-entree-${reservation.id.slice(0, 8)}.pdf`
      : `etat-lieux-sortie-${reservation.id.slice(0, 8)}.pdf`

    // Return PDF
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error generating inventory PDF:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'état des lieux' },
      { status: 500 }
    )
  }
}
