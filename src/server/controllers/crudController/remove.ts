import { type Document, type Model } from 'mongoose'
import { type DeleteResult } from 'mongodb'

import AppError from '@/utils/appError'
import httpStatus from 'http-status'

export const deleteOne = async (model: Model<Document>, recordId: string): Promise<any> => {
  const deletedRecord = await model.findOneAndDelete({ _id: recordId })
  if (deletedRecord !== null) {
    return deletedRecord
  }

  throw new AppError(httpStatus.NOT_FOUND, 'Record not found!')
}

// Delete many records
export const deleteMany = async (
  model: Model<Document>,
  recordIds: string[]
): Promise<DeleteResult> => {
  const deletedRecords = await model.deleteMany({
    _id: { $in: recordIds }
  })
  return deletedRecords
}
