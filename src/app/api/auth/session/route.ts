import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData, defaultSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.json({ session: defaultSession })
    }

    return NextResponse.json({
      session: {
        userId: session.userId,
        email: session.email,
        firstName: session.firstName,
        lastName: session.lastName,
        role: session.role,
        isLoggedIn: session.isLoggedIn,
      },
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ session: defaultSession })
  }
}
