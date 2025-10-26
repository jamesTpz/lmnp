import { SessionOptions } from 'iron-session'

export interface SessionData {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  role: 'OWNER' | 'ADMIN'
  isLoggedIn: boolean
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'lmnp-serenity-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  },
}

export const defaultSession: SessionData = {
  userId: '',
  email: '',
  firstName: '',
  lastName: '',
  role: 'OWNER',
  isLoggedIn: false,
}
