import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all expenses for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const expenses = await prisma.expense.findMany({
      where: {
        OR: [
          { mobileHomeId: null }, // Global expenses
          {
            mobileHome: {
              ownerId: session.userId,
            },
          },
        ],
      },
      include: {
        mobileHome: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json({ expenses })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des dépenses' },
      { status: 500 }
    )
  }
}

// POST create a new expense
export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const {
      mobileHomeId,
      category,
      description,
      amount,
      date,
      invoiceUrl,
      taxDeductible,
      notes,
    } = body

    // If mobileHomeId provided, verify ownership
    if (mobileHomeId) {
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
    }

    const expense = await prisma.expense.create({
      data: {
        mobileHomeId: mobileHomeId || null,
        category,
        description,
        amount,
        date: new Date(date),
        invoiceUrl,
        taxDeductible: taxDeductible ?? true,
        notes,
      },
      include: {
        mobileHome: true,
      },
    })

    return NextResponse.json({ expense }, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la dépense' },
      { status: 500 }
    )
  }
}
