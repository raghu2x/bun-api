import { type ClientErrorStatusCode, type ServerErrorStatusCode } from 'hono/utils/http-status'

class AppError extends Error {
  public statusCode: ServerErrorStatusCode | ClientErrorStatusCode
  // public status: string

  constructor(statusCode: ServerErrorStatusCode | ClientErrorStatusCode, message: string) {
    super(message)
    this.statusCode = statusCode
    this.message = message
  }
}

export default AppError
