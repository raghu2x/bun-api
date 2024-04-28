import { loginAccount } from '@/server/controllers/coreController/authController/signIn'
import createAccount from '@/server/controllers/coreController/adminController/create'
import forgotPassword from './forgot-password'
import resetPassword from './reset-password'

export default {
  createAccount,
  loginAccount,
  forgotPassword,
  resetPassword
}
