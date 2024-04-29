import { compare, generateToken } from '@/utils/authUtils'
import type { LoginData } from '@/types/authentication'
import AppError from '@/utils/appError'
import httpStatus from 'http-status'
import AdminModel from '@/server/schema/master/admin.model'

const adminLogin = async (userData: LoginData) => {
  const { remember, institutionName, userType, email, password } = userData

  const model = AdminModel.createModel('master_database')
  // 1. get User using email
  const user = await model.get(email)

  // 2. compare passwords
  if (!(await compare(password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Email or Password is wrong')
  }

  // 3. check email verification
  if (!user.verified) throw new AppError(httpStatus.UNAUTHORIZED, 'Account is not verified')

  const { password: userPassword, ...responseUser } = user.toJSON()

  const jwtOptions = {
    expiresIn: remember === true ? '36h' : process.env.JWT_TOKEN_EXPIRY
  }

  const tokenPayload = {
    userId: user._id,
    email,
    userType,
    institutionName
  }
  const token = await generateToken(tokenPayload, jwtOptions)

  console.log('👍 User verified login In.')

  return { ...responseUser, token }
}

export default adminLogin
