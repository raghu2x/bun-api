import authController from '@/server/controllers/coreController/authController'
import adminController from '@/server/controllers/coreController/adminController'

import { createAccountLimiter } from '@/utils/rateLimiter'
import { Hono } from 'hono'

const router = new Hono()

// router.use('/register', createAccountLimiter)

router.post('/register', createAccountLimiter, adminController.createAccount)
router.post('/verify-contact', adminController.verifyAccount)

router.post('/login', authController.loginAccount)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

export default router
