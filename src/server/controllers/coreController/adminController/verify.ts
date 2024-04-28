import { sendErrorResponse, sendSuccessResponse } from '@/utils/apiResponse'
import userValidation from '@/server/validations/user.validation'
import httpStatus from 'http-status'
import AdminModel from '@/server/schema/master/admin.model'
import { type CustomRequestHandler } from '@/types/common'
import AppError from '@/utils/appError'
import OtpModel from '@/server/schema/otp'
import { verifyOTP } from '@/server/services/otpService'
import { type Context } from 'hono'

interface Payload {
  email: string
  otp: number
}

const verifyAccount: CustomRequestHandler = async (c: Context) => {
  try {
    const body = await c.req.json()

    const model = AdminModel.createModel('master_database')

    const { email, otp }: Payload = await userValidation.verifyAccount.validateAsync(body)

    // @ts-expect-error - issue in get
    const existingUser: IAdminUser = await model.get(email)
    if (existingUser.verified) {
      throw new AppError(httpStatus.BAD_REQUEST, 'User account already verified.')
    }

    const otpModel = OtpModel.createModel('master_database')

    await verifyOTP(otpModel, { email, otp })

    const user = await model.findOneAndUpdate({ email }, { verified: true }, { new: true })

    if (user == null) {
      throw new AppError(httpStatus.NOT_FOUND, `User not found with email: ${email}`)
    }

    const { password: userPassword, ...responseUser } = user.toObject()

    return sendSuccessResponse(c, responseUser, httpStatus.OK, 'Account verified successfully.')
  } catch (error) {
    return sendErrorResponse(c, error.statusCode, error.message)
  }
}

export default verifyAccount
