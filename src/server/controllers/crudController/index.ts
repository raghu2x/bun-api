import { type Model, type Document, type Schema } from 'mongoose'
import { sendErrorResponse, sendSuccessResponse } from '@/utils/apiResponse'
import httpStatus from 'http-status'
import { type CustomRequestHandler, type AuthenticatedUser } from '@/types/common'
import { getAll, getOne } from './getRecords'
import { create } from './create'
import { updateOne } from './update'
import { deleteMany, deleteOne } from './remove'

type FunctionI = (modelName: (instituteName: string) => Model<any>) => CustomRequestHandler

const getAllRecords: FunctionI = getModel => {
  return async (c, next) => {
    try {
      const institutionName = c.get('institutionName')

      const model = getModel(institutionName)

      console.log(model)
      const data = await getAll(model, c.req.query())

      return sendSuccessResponse(c, data, httpStatus.OK)
    } catch (error: any) {
      return sendErrorResponse(c, error.statusCode, error.message)
    }
  }
}

const getRecordById: FunctionI = getModel => {
  return async (c, next) => {
    const { id } = c.req.param()
    const institutionName = c.get('institutionName')

    const model = getModel(institutionName)

    try {
      const data: Record<string, any> = await getOne(model, id)
      return sendSuccessResponse(c, data, httpStatus.OK)
    } catch (error: any) {
      return sendErrorResponse(c, error.statusCode, error.message)
    }
  }
}

const createRecord: FunctionI = getModel => {
  return async (c, next) => {
    try {
      const body = await c.req.json()
      const institutionName = c.get('institutionName')
      const model = getModel(institutionName)

      // 1. check if validations are defined
      // if (validations[modelName]?.create !== undefined) {
      //   await c.req.json() = await validations[modelName].create.validateAsync(body)
      // }

      const data: Record<string, any> = await create(model, body)

      return sendSuccessResponse(c, data, httpStatus.CREATED, 'New record created')
    } catch (error: any) {
      console.error('errror')
      return sendErrorResponse(c, error.statusCode, error.message)
    }
  }
}

const updateRecordById: FunctionI = getModel => {
  return async (c, next) => {
    const { id } = c.req.param()
    const record = await c.req.json()
    const institutionName = c.get('institutionName')

    const model = getModel(institutionName)

    try {
      const data = await updateOne(model, id, record)

      return sendSuccessResponse(c, data, httpStatus.OK, 'Record updated successfully')
    } catch (error: any) {
      return sendErrorResponse(c, error.statusCode, error.message)
    }
  }
}

const deleteRecordById: FunctionI = getModel => {
  return async (c, next) => {
    const { id } = c.req.param()
    const institutionName = c.get('institutionName')

    const model = getModel(institutionName)

    try {
      const data = await deleteOne(model, id)
      return sendSuccessResponse(c, data, httpStatus.OK, 'Record Deleted successfully')
    } catch (error: any) {
      return sendErrorResponse(c, error.statusCode, error.message)
    }
  }
}

const deleteManyRecords: FunctionI = getModel => {
  return async (c, next) => {
    const { ids }: { ids: string[] } = await c.req.json()
    const institutionName = c.get('institutionName')

    const model = getModel(institutionName)

    try {
      const data = await deleteMany(model, ids)

      return sendSuccessResponse(c, data, httpStatus.OK, `Deleted ${data.deletedCount} records`)
    } catch (error: any) {
      return sendErrorResponse(c, error.statusCode, error.message)
    }
  }
}

export default {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecordById,
  deleteRecordById,
  deleteManyRecords
}
