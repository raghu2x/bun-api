import { type Context } from 'hono'
import { type StatusCode, type SuccessStatusCode } from 'hono/utils/http-status'
import httpStatus from 'http-status'
import AppError from './appError'

interface Payload {
  success: boolean
  timestamp: Date
  message?: string
  statusCode: number
  data?: any
  error?: Record<string, any>
}

export const sendSuccessResponse = <S extends Context, T = any>(
  c: S,
  data?: T,
  statusCode: SuccessStatusCode = httpStatus.OK,
  message?: string
): Response => {
  const payload: Payload = {
    success: true,
    timestamp: new Date(),
    data,
    message,
    statusCode
  }

  return c.json(payload, statusCode)
}

export const sendErrorResponse = <S extends Context>(
  c: S,
  statusCode: StatusCode = httpStatus.INTERNAL_SERVER_ERROR,
  message?: string,
  error?: any
): Response => {
  const payload: Payload = {
    success: false,
    timestamp: new Date(),
    statusCode,
    // @ts-expect-error - 102 is not available in statusCode
    message: message ?? httpStatus[statusCode],
    error
  }

  return c.json(payload, statusCode)
}

export const SendEndpointNotFoundResponse = <S extends Context>(c: S): Response => {
  const payload: Payload = {
    success: false,
    timestamp: new Date(),
    statusCode: httpStatus.NOT_FOUND,
    message: "Requested endpoint doesn't exist or method not allowed!"
  }

  return c.json(payload, httpStatus.NOT_FOUND)
}

export const SendAccountCreatedResponse = <S extends Context, T = any>(c: S, data: T): Response => {
  c.status(httpStatus.CREATED)

  return c.json({
    success: true,
    timestamp: new Date(),
    statusCode: httpStatus.CREATED,
    message: 'Account created. Verify your email to continue.',
    data
  })
}

export const SendLoginResponse = <S extends Context, T = any>(c: S, data: T): Response => {
  c.status(httpStatus.OK)

  return c.json({
    success: true,
    timestamp: new Date(),
    statusCode: httpStatus.OK,
    message: 'Login successfull',
    data
  })
}

export const handleErrors = <S extends Context>(c: S, error: unknown) => {
  if (error instanceof AppError) {
    return sendErrorResponse(c, error.statusCode, error.message)
  }

  // @ts-expect-error - just ignore it
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return sendErrorResponse(c, error?.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR, error?.message)
}
