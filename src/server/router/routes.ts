import { sendErrorResponse } from '@/utils/apiResponse'
import { Hono } from 'hono'

const router = new Hono()

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
