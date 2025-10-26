import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH update a task
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
    const existingTask = await prisma.operationalTask.findFirst({
      where: {
        id: params.id,
        mobileHome: {
          ownerId: session.userId,
        },
      },
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Tâche non trouvée' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const updates: any = {}

    if (body.type) updates.type = body.type
    if (body.title) updates.title = body.title
    if (body.description !== undefined) updates.description = body.description
    if (body.assignedTo !== undefined) updates.assignedTo = body.assignedTo
    if (body.dueDate) updates.dueDate = new Date(body.dueDate)
    if (body.status) {
      updates.status = body.status
      if (body.status === 'COMPLETED') {
        updates.completedAt = new Date()
      }
    }
    if (body.notes !== undefined) updates.notes = body.notes

    const task = await prisma.operationalTask.update({
      where: { id: params.id },
      data: updates,
      include: {
        mobileHome: true,
        reservation: true,
      },
    })

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la tâche' },
      { status: 500 }
    )
  }
}

// DELETE a task
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
    const task = await prisma.operationalTask.findFirst({
      where: {
        id: params.id,
        mobileHome: {
          ownerId: session.userId,
        },
      },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Tâche non trouvée' },
        { status: 404 }
      )
    }

    await prisma.operationalTask.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la tâche' },
      { status: 500 }
    )
  }
}
