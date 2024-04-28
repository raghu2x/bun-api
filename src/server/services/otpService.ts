import AppError from '@/utils/appError'
import { generateOTP } from '@/utils/authUtils'
import httpStatus from 'http-status'

interface OtpData {
  email: string
  otp?: number
}

const checkIfOtpExists = async (otpModel, email: string): Promise<OtpData | false> => {
  const otpExist = await otpModel.findOne({ email })
  if (otpExist != null) return otpExist
  return false
}

const saveOTP = async (otpModel, { email }: OtpData): Promise<OtpData> => {
  const existingOtp = await checkIfOtpExists(otpModel, email)
  if (existingOtp !== false) return existingOtp

  const otp = generateOTP()

  const newOtp = await otpModel.create({ otp, email })
  console.log('🙈 new OTP generated:', newOtp)
  return newOtp
}

const verifyOTP = async (model, { email, otp }: OtpData): Promise<boolean> => {
  const existingOtp = await checkIfOtpExists(model, email)
  if (existingOtp === false) throw new AppError(httpStatus.BAD_REQUEST, 'OTP expired.')

  if (existingOtp.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please enter correct OTP.')
  }

  // OTP is verified
  return true
}

export { saveOTP, verifyOTP }
