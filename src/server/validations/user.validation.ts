import { USER_TYPES } from '@/data/constants'
import * as Joi from 'joi'

// console.log(Object.values(USER_TYPES))
/**
 * one uppercase
 * one lowercase
 * one special character [#?!@$%^&*-]
 * one number
 * length between 8 - 30
 */
const passwordRegx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/

const register = Joi.object({
  firstName: Joi.string().max(30).required(),
  lastName: Joi.string().max(30).required(),
  email: Joi.string().required().email(),
  password: Joi.string().pattern(passwordRegx).required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
})

const login = Joi.object({
  email: Joi.string().email().max(30),
  userId: Joi.string().max(30),
  password: Joi.string().required().max(30),
  remember: Joi.boolean(),
  institutionName: Joi.string().required().max(30),
  userType: Joi.required().valid(...Object.values(USER_TYPES))
})

const forgotPassword = Joi.object({
  email: Joi.string().required().email()
})

const resetPassword = Joi.object({
  email: Joi.string().email(),
  otp: Joi.number().required(),
  password: Joi.string().required().pattern(passwordRegx),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
})

const changePassword = Joi.object({
  email: Joi.string().email(),
  currentPassword: Joi.string().required(),
  password: Joi.string().required().pattern(passwordRegx),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
})

export const verifyAccount = Joi.object({
  email: Joi.string().email().max(30),
  otp: Joi.string().max(6).min(6)
})

export default { register, login, forgotPassword, resetPassword, changePassword, verifyAccount }
