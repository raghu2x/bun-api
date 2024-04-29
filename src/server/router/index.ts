// import auth from '@/server/controllers/coreController/authController/verifyToken'
import routes from './routes'
import authRouter from './authRouter'
import crudRouter from '@/server/router/apiRouter'
import { SendEndpointNotFoundResponse } from '@/utils/apiResponse'
import coreRouter from './coreRouter'
// import fileUploadRouter from './coreRouter/fileUploadRouter'
import fileUploadRouter from './coreRouter/fileUploadRouter'
import { Hono } from 'hono'

const router = new Hono()

router.get('/', c => {
  return c.json({
    success: true,
    message: 'hey welcome to our app'
  })
})

// routes
router.route('/api', crudRouter)
router.route('/api/admin', routes)
router.route('/api/auth', authRouter)
router.route('/api', fileUploadRouter)

router.route('', coreRouter.corePublicRoute)
router.all('*', SendEndpointNotFoundResponse)

export default router
