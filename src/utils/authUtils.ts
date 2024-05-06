import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken' // use for generating auth token
// import * as bcrypt from 'node:bcrypt'
// import { sign, verify } from 'hono/jwt'
import { type JWTPayload } from 'hono/utils/jwt/types'

const generateOTP = (otpLength: number = 6): number => {
  let OTP: number = 0
  const maxDigitValue: number = 9

  for (let i = 0; i < otpLength; i++) {
    const randomDigit: number = crypto.randomInt(0, maxDigitValue + 1)
    OTP = OTP * 10 + randomDigit // here lot of calc only for a number otp
  }

  return OTP
}

// TODO: use this if hono jwt middleware issue fixed
// generate JWT token
// const generateToken = (payload: JWTPayload): Promise<string> => {
//   const jwtToken: string = process.env.JWT_TOKEN as string

//   const jwtPayload: JWTPayload = {
//     exp: process.env.JWT_TOKEN_EXPIRY,
//     ...payload
//   }

//   return sign(jwtPayload, jwtToken)
// }

// /**
//  * @param token token for varification
//  * @returns
//  */
// const verifyJwtToken = async <T extends JWTPayload>(token: string): Promise<T> => {
//   const jwtToken: string = process.env.JWT_TOKEN as string
//   return verify(token, jwtToken)
// }

type TokenData = object | string | Buffer
// generate JWT token
const generateToken = (payload: TokenData, options?: jwt.SignOptions): string => {
  const jwtToken: jwt.Secret = process.env.JWT_TOKEN ?? ''

  const opt: jwt.SignOptions = {
    expiresIn: process.env.JWT_TOKEN_EXPIRY,
    ...options
  }

  return jwt.sign(payload, jwtToken, opt)
}

/**
 * This function is used to verify JWT Token but it's not in use
 * @param token token for varification
 * @returns
 */
const verifyJwtToken = <T extends JWTPayload>(token: string): T => {
  const jwtToken: jwt.Secret = process.env.JWT_TOKEN ?? ''
  return jwt.verify(token, jwtToken) as T
}

/**
 * Encrypts a given value using bcrypt
 * @param {string} value - The value to encrypt
 * @param {number} [length=10] - The number of rounds of encryption to use (default: 10)
 * @returns {Promise<string>} - A promise that resolves to the encrypted value
 */
const encrypt = async (plaintext: string): Promise<string> => {
  return await Bun.password.hash(plaintext)
  // return encryptedValue;
}

/**
 * Compares two given values using bcrypt to determine if they match
 * @param {string} plaintext - The plaintext value to compare
 * @param {string} hash - The hash value to compare
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the values match
 */
const compare = async (plaintext: string, hash: string): Promise<boolean> => {
  return await Bun.password.verify(plaintext, hash)
  // return isSame;
}

const getResetToken = (length: number = 20, type: BufferEncoding = 'hex'): string => {
  const token = crypto.randomBytes(length).toString(type)
  return token
}

export { generateToken, verifyJwtToken, generateOTP, encrypt, compare, getResetToken }
