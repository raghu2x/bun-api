import { type Model, type Document } from 'mongoose'
import { handleErrors, sendSuccessResponse } from '@/utils/apiResponse'
import httpStatus from 'http-status'
import { type CustomRequestHandler } from '@/types/common'
import { getAll, getOne } from './getRecords'
import { create } from './create'
import { updateOne } from './update'
import { deleteMany, deleteOne } from './remove'

type FunctionI = (modelName: (instituteName: string) => Model<Document>) => CustomRequestHandler

const getAllRecords: FunctionI = getModel => {
  return async (c, _next) => {
    try {
      const institutionName: string = c.get('institutionName')

      const model = getModel(institutionName)

      console.log(model)
      const data = await getAll(model, c.req.query())

      return sendSuccessResponse(c, data, httpStatus.OK)
    } catch (error: any) {
      return handleErrors(c, error)
    }
  }
}

const getRecordById: FunctionI = getModel => {
  return async (c, _next) => {
    const { id } = c.req.param()
    const institutionName: string = c.get('institutionName')

    const model = getModel(institutionName)

    try {
      const data: Record<string, any> = await getOne(model, id)
      return sendSuccessResponse(c, data, httpStatus.OK)
    } catch (error: any) {
      return handleErrors(c, error)
    }
  }
}

const createRecord: FunctionI = getModel => {
  return async (c, _next) => {
    try {
      const body = await c.req.json()
      const institutionName: string = c.get('institutionName')
      const model = getModel(institutionName)

      // 1. check if validations are defined
      // if (validations[modelName]?.create !== undefined) {
      //   await c.req.json() = await validations[modelName].create.validateAsync(body)
      // }

      const data: Record<string, any> = await create(model, body)

      return sendSuccessResponse(c, data, httpStatus.CREATED, 'New record created')
    } catch (error: any) {
      console.error('errror')
      return handleErrors(c, error)
    }
  }
}

const updateRecordById: FunctionI = getModel => {
  return async (c, _next) => {
    const { id } = c.req.param()
    const record: Record<string, any> = await c.req.json()
    const institutionName: string = c.get('institutionName')

    const model = getModel(institutionName)

    try {
      const data = await updateOne(model, id, record)

      return sendSuccessResponse(c, data, httpStatus.OK, 'Record updated successfully')
    } catch (error: any) {
      return handleErrors(c, error)
    }
  }
}

const deleteRecordById: FunctionI = getModel => {
  return async (c, _next) => {
    const { id } = c.req.param()
    const institutionName: string = c.get('institutionName')

    const model = getModel(institutionName)

    try {
      const data = await deleteOne(model, id)
      return sendSuccessResponse(c, data, httpStatus.OK, 'Record Deleted successfully')
    } catch (error: any) {
      return handleErrors(c, error)
    }
  }
}

const deleteManyRecords: FunctionI = getModel => {
  return async (c, _next) => {
    const { ids }: { ids: string[] } = await c.req.json()
    const institutionName: string = c.get('institutionName')

    const model = getModel(institutionName)

    try {
      const data = await deleteMany(model, ids)

      return sendSuccessResponse(c, data, httpStatus.OK, `Deleted ${data.deletedCount} records`)
    } catch (error: any) {
      return handleErrors(c, error)
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
