import { sendErrorResponse } from '@/utils/apiResponse'
import httpStatus from 'http-status'
import { env } from '@/utils/env'
import { type AuthenticatedUser } from '@/types/common'
import { type Context, type Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { verifyJwtToken } from '@/utils/authUtils'

const verifyToken = async (c: Context, next: Next) => {
  const token = getCookie(c, env('HEADER_TOKEN_KEY'))

  console.log('🤞 authenticating user')
  if (token !== undefined) {
    try {
      const user = await verifyJwtToken<AuthenticatedUser>(token)

      c.set('user', user)
      c.set('institutionName', user.institutionName)
      await next()
    } catch (error) {
      return sendErrorResponse(c, httpStatus.UNAUTHORIZED, 'Invalid Token!')
    }
  } else {
    return sendErrorResponse(c, httpStatus.UNAUTHORIZED, 'Authentication Token required')
  }
}

export default verifyToken
