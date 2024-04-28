import { MAIL_SETTINGS } from '@/config'
import { sendErrorResponse } from '@/utils/apiResponse'
import { Hono } from 'hono'

const router = new Hono()

router.get('/', c => {
  return c.json({
    success: true,
    message: 'hey welcome to our app'
  })
})

router.get('/api/env', c => {
  console.log('email 18', MAIL_SETTINGS)
  return c.json({
    success: true,
    message: 'hey welcome to our app',
    env: MAIL_SETTINGS
  })
})

// const sendEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const OTP = generateOTP()
//   const data = { OTP, to: 'raghvendra4077@gmail.com' }
//   try {
//     await sendMail(data)
//     res.send({ success: true, message: 'Email sent' })
//   } catch (error) {
//     next(error)
//   }
// }

router.post('/api/create-tenant', async c => {
  try {
    // const model = getDBModel(req.masterDb, 'tenant')
    // const existingTenant = await model.findOne({ schoolId: req.body.schoolId })
    // if (existingTenant != null) throw new AppError(httpStatus.CONFLICT, 'schoolId already exist')
    // const data = await model.create(req.body)
    // sendSuccessResponse(res, data, httpStatus.CREATED, 'Tenant created!')
  } catch (error: any) {
    return sendErrorResponse(c, error.statusCode, error.message)
  }
})

export default router
