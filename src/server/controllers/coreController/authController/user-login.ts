import { generateToken } from '@/utils/authUtils'
import type { LoginData } from '@/types/authentication'
import { type SignOptions } from 'jsonwebtoken'
import AppError from '@/utils/appError'
import httpStatus from 'http-status'
import { type Model } from 'mongoose'
/**
 * This function will be used for authenticate : student|staff|parent
 * @param userData - LoginReq data
 * @param model - user model
 * @returns
 */
const userLogin = async <T>(userData: LoginData, model: Model<T>): Promise<any> => {
  const { remember, institutionName, userId, userType, password } = userData

  const user = await model.findOne({
    'loginDetail.password': password,
    'loginDetail.id': userId
  })

  if (user === null) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'userId or password is wrong.')
  }

  // @ts-expect-error - just ignore it
  const { loginDetail, ...responseUser } = user.toJSON()

  const jwtOptions: SignOptions = {
    expiresIn: remember === true ? '36h' : process.env.JWT_TOKEN_EXPIRY
  }

  const tokenPayload = {
    userId: user._id,
    userType,
    institutionName
  }
  const token = generateToken(tokenPayload, jwtOptions)

  console.log('👍 User verified login In.')

  return { ...responseUser, token }
}

export default userLogin
