import { SessionOptions } from 'iron-session'

export interface SessionData {
  userId: string
  email: string
  firstName?: string
  lastName?: string
  role: 'OWNER' | 'ADMIN'
  isLoggedIn: boolean
}

const devFallbackSecret =
  'dev-only-session-secret-must-be-at-least-32-characters-long'

const sessionPassword =
  process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32
    ? process.env.SESSION_SECRET
    : devFallbackSecret

export const sessionOptions: SessionOptions = {
  password: sessionPassword,
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
