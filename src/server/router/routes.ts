import { sendErrorResponse, sendSuccessResponse } from '@/utils/apiResponse'
import AppError from '@/utils/appError'
import { Hono, type Next, type Context } from 'hono'
import httpStatus from 'http-status'
import instituteModel from '../schema/master/institute.model'

const router = new Hono()

export const checkInstitute = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json()
    const model = instituteModel.createModel('master_database')

    const institute = await model.findOne({ schoolId: body.institutionName })

    if (institute === null) {
      throw new AppError(httpStatus.NOT_FOUND, 'School not found!')
    }

    c.set('institute', institute)
    await next()
  } catch (error) {
    return sendErrorResponse(c, error.statusCode, error.message)
  }
}

router.post('/create-institute', async c => {
  try {
    const body = await c.req.json()

    const model = instituteModel.createModel('master_database')
    const existingTenant = await model.findOne({ schoolId: body.schoolId })

    if (existingTenant != null) {
      throw new AppError(httpStatus.CONFLICT, 'schoolId already exist')
    }

    const data = await model.create(body)
    return sendSuccessResponse(c, data, httpStatus.CREATED, 'Tenant created!')
  } catch (error: any) {
    return sendErrorResponse(c, error.statusCode, error.message)
  }
})

export default router
