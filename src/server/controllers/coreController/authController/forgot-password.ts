import { handleErrors, sendSuccessResponse } from '@/utils/apiResponse'
import userValidation from '@/server/validations/user.validation'
import httpStatus from 'http-status'
import { type CustomRequestHandler } from '@/types/common'
import { saveOTP } from '@/server/services/otpService'
import sendMail from '@/server/services/sendEmail'
import { type Context } from 'hono'

interface ForgotPasswordReqData {
  email: string
}

const sendVerificationEmail = async (dbName: string, email: string): Promise<void> => {
  try {
    const { otp } = await saveOTP(dbName, { email })
    // @ts-expect-error - otp key issue
    await sendMail({ to: email, otp })

    console.log('Verification email sent.')
  } catch (error) {
    console.log('😢 Can not send Verification mail')
  }
}

const forgotPassword: CustomRequestHandler = async (ctx: Context) => {
  try {
    const body = await ctx.req.json()
    const payload: ForgotPasswordReqData = await userValidation.forgotPassword.validateAsync(body)

    void sendVerificationEmail('master_database', payload.email)

    return sendSuccessResponse(
      ctx,
      undefined,
      httpStatus.OK,
      'OTP sent on your email for password reset.'
    )
  } catch (error) {
    return handleErrors(ctx, error)
  }
}

export default forgotPassword
