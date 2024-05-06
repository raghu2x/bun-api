import { type UserRegistrationData } from '@/types/authentication'
import { SendAccountCreatedResponse, sendErrorResponse } from '@/utils/apiResponse'
import userValidation from '@/server/validations/user.validation'
import httpStatus from 'http-status'
import AdminModel from '@/server/schema/master/admin.model'
import { type CustomRequestHandler } from '@/types/common'
import { encrypt } from '@/utils/authUtils'
import { saveOTP } from '@/server/services/otpService'
import OtpModel from '@/server/schema/otp'
import sendMail from '@/server/services/sendEmail'

const sendVerificationEmail = async (tenantId: string, email: string): Promise<void> => {
  try {
    const otpModel = OtpModel.createModel(tenantId)

    const { otp } = await saveOTP(otpModel, { email })
    // @ts-expect-error - otp key issue
    await sendMail({ to: email, otp })

    console.log('Verification email sent.')
  } catch (error) {
    console.log('😢 Can not send Verification mail')
  }
}
// create account
const createAccount: CustomRequestHandler = async c => {
  try {
    const model = AdminModel.createModel('master_database')

    const body = await c.req.json()
    // 1. validate req data
    const userRegData: UserRegistrationData = await userValidation.register.validateAsync(body)

    // 2. encrypt password
    userRegData.password = await encrypt(userRegData.password)

    // 3. create user
    const createdUser = await model.create(userRegData)
    const { password: userPassword, ...responseUser } = createdUser.toJSON()

    // send verification email
    void sendVerificationEmail('master_database', userRegData.email)

    return SendAccountCreatedResponse(c, responseUser)
  } catch (error: any) {
    // mongoose error code
    if (error.code === 11000) {
      return sendErrorResponse(c, httpStatus.CONFLICT, "'Email' already exists")
    }
    return sendErrorResponse(c, error.statusCode, error.message)
  }
}

export default createAccount
