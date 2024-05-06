import { type Context, type Next } from 'hono'
import { type Connection } from 'mongoose'
import { type UserTypes } from './authentication'

/* =============== Express ================= */
export interface AuthenticatedUser {
  userId: string
  institutionName: string
  userType: UserTypes
  email: string
}
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser // Use union type to make it flexible
  masterDb: Connection
  schoolDb: Connection
}

export type CustomRequestHandler = (c: Context, next: Next) => Promise<Response> | Response
