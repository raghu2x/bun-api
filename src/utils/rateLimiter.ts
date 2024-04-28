import { rateLimiter } from 'hono-rate-limiter'
import { sendErrorResponse } from './apiResponse'

export const createAccountLimiter = rateLimiter({
  async handler(c, _next, options) {
    const responseMessage =
      typeof options.message === 'function' ? await options.message(c) : options.message

    return sendErrorResponse(c, options.statusCode, responseMessage as string)
  },
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 50, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message: 'Too many accounts created from this IP, please try again after an hour',
  standardHeaders: 'draft-7' // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
})

export const apiLimiter = rateLimiter({
  async handler(c, _next, options) {
    const responseMessage =
      typeof options.message === 'function' ? await options.message(c) : options.message

    return sendErrorResponse(c, options.statusCode, responseMessage as string)
  },
  windowMs: 60 * 1000, // 1 minute
  limit: 50,
  message: 'Too Many Request from this IP, please try again in an hour',
  standardHeaders: 'draft-7' // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
})
