import AppError from '@/utils/appError'
import { generateOTP } from '@/utils/authUtils'
import httpStatus from 'http-status'
import OtpModel from '@/server/schema/otp'

interface OtpData {
  email: string
  otp?: number
}

const saveOTP = async (tenantId: string, { email }: OtpData) => {
  const otpModel = OtpModel.createModel(tenantId)

  const existingOtp = await otpModel.findOne({ email })
  if (existingOtp !== null) return existingOtp

  const otp = generateOTP()

  const newOtp = await otpModel.create({ otp, email })
  console.log('🙈 new OTP generated:', newOtp)
  return newOtp
}

const verifyOTP = async (tenantId: string, { email, otp }: OtpData): Promise<boolean> => {
  const otpModel = OtpModel.createModel(tenantId)

  const existingOtp = await otpModel.findOne({ email })
  if (existingOtp === null) throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired.')

  if (existingOtp.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please enter correct OTP.')
  }

  // OTP is verified
  return true
}

export { saveOTP, verifyOTP }
