import { sendErrorResponse } from '@/utils/apiResponse'
import type AppError from '@/utils/appError'
import { Context } from 'hono'
import { ClientErrorStatusCode, ServerErrorStatusCode } from 'hono/utils/http-status'
import httpStatus from 'http-status'

const handleErrors = (err: AppError, c: Context): Response => {
  const statusCode = err.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR

  return sendErrorResponse(c, statusCode, err.message)
}

export default handleErrors
