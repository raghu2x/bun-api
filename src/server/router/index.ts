import auth from '@/server/controllers/coreController/authController/verifyToken'
import routes from './routes'
import authRouter from './authRouter'
import crudRouter from '@/server/router/apiRouter'
import { apiLimiter } from '@/utils/rateLimiter'
import { SendEndpointNotFoundResponse } from '@/utils/apiResponse'
import coreRouter from './coreRouter'
// import fileUploadRouter from './coreRouter/fileUploadRouter'
import { Hono } from 'hono'

const router = new Hono()

// routes
router.route('/', routes)
router.route('/api/auth', authRouter)
// router.route('/api', fileUploadRouter)

router.use('/api/*', auth)

router.route('/api', crudRouter)

router.route('', coreRouter.corePublicRoute)
router.all('*', SendEndpointNotFoundResponse)

export default router
