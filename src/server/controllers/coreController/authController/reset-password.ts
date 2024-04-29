import { encrypt } from '@/utils/authUtils'
import { sendErrorResponse, sendSuccessResponse } from '@/utils/apiResponse'
import userValidation from '@/server/validations/user.validation'
import httpStatus from 'http-status'

import AdminModel from '@/server/schema/master/admin.model'
import { type CustomRequestHandler } from '@/types/common'
import { verifyOTP } from '@/server/services/otpService'
import OtpModel from '@/server/schema/otp'
import AppError from '@/utils/appError'
import { Context } from 'hono'

interface ResetPasswordData {
  otp: number
  password: string
  email: string
  confirmPassword: string
}

const resetPassword: CustomRequestHandler = async (ctx: Context) => {
  try {
    const body = await ctx.req.json()
    const model = AdminModel.createModel('master_database')
    const payload: ResetPasswordData = await userValidation.resetPassword.validateAsync(body)

    const otpModel = OtpModel.createModel('master_database')

    await verifyOTP(otpModel, { email: payload.email, otp: payload.otp })

    // encrypt password
    const password = await encrypt(payload.password)

    const user = await model.findOneAndUpdate({ email: payload.email }, { password }, { new: true })

    if (user == null) {
      throw new AppError(httpStatus.NOT_FOUND, `User not found with email: ${payload.email}`)
    }

    const { password: userPassword, ...responseUser } = user.toJSON()

    return sendSuccessResponse(ctx, responseUser, httpStatus.OK, 'Password reset successfully.')
  } catch (error) {
    return sendErrorResponse(ctx, error.statusCode, error.message)
  }
}

export default resetPassword
