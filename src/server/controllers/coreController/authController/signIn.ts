import userValidation from '@/server/validations/user.validation'
import { SendLoginResponse, sendErrorResponse } from '@/utils/apiResponse'
import adminLogin from './admin-login'
import userLogin from './user-login'
import { env } from '@/utils/env'
import AppError from '@/utils/appError'
import httpStatus from 'http-status'
import { type LoginData } from '@/types/authentication'
// models
import { UserModel } from '@/server/schema/institute/user.model'
import StudentModel from '@/server/schema/institute/student.model'
import { USER_TYPES } from '@/data/constants'
import { type CustomRequestHandler } from '@/types/common'
import { setCookie } from 'hono/cookie'

interface LoginResponse {
  token: string
}

const cookieOptions = {
  httpOnly: true,
  secure: true,
  path: '/'
}

export const loginAccount: CustomRequestHandler = async c => {
  // const ipAddress = req.headers['x-forwarded-for'] ?? req.connection.remoteAddress
  try {
    const body = await c.req.json()

    console.log(body.userType)
    const loginData: LoginData = await userValidation.login.validateAsync(body)

    const { userType, institutionName, remember } = loginData

    let user: LoginResponse = { token: '' }
    let model

    switch (userType) {
      case USER_TYPES.ADMIN:
        user = await adminLogin(loginData)
        break
      case USER_TYPES.STUDENT:
        model = StudentModel.createModel(institutionName)
        user = await userLogin(loginData, model)
        break
      case USER_TYPES.STAFF:
        model = UserModel.createModel(institutionName)
        user = await userLogin(loginData, model)
        break
      default:
        throw new AppError(httpStatus.BAD_REQUEST, `'${userType}' is not a valid userType.`)
    }

    const hostname = c.req.header('hostname')
    // Generate token & send Response
    const isLocalhost = hostname === 'localhost'

    const ONE_DAY = 24 * 60 * 60 // Cookie expires after 1 day
    const ONE_YEAR = 365 * ONE_DAY // Cookie expires after 365 days

    setCookie(c, env('HEADER_TOKEN_KEY'), user.token, {
      ...cookieOptions,
      maxAge: remember === true ? ONE_YEAR : ONE_DAY,
      sameSite: env('NODE_ENV') === 'production' && !isLocalhost ? 'Lax' : 'None',
      domain: hostname
    })

    return SendLoginResponse(c, user)
  } catch (error: any) {
    return sendErrorResponse(c, error.statusCode, error.message)
  }
}
