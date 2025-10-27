import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all tasks for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const tasks = await prisma.operationalTask.findMany({
      where: {
        mobileHome: {
          ownerId: session.userId,
        },
      },
      include: {
        mobileHome: true,
        reservation: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des tâches' },
      { status: 500 }
    )
  }
}

// POST create a new task
export async function POST(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const {
      mobileHomeId,
      reservationId,
      type,
      title,
      description,
      assignedTo,
      dueDate,
      status,
      notes,
    } = body

    // Verify mobile home belongs to user
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

    const task = await prisma.operationalTask.create({
      data: {
        mobileHomeId,
        reservationId: reservationId || null,
        type,
        title,
        description,
        assignedTo,
        dueDate: new Date(dueDate),
        status,
        notes,
      },
      include: {
        mobileHome: true,
        reservation: true,
      },
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la tâche' },
      { status: 500 }
    )
  }
}
