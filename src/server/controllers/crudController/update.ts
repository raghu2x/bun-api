import { type Document, type Model } from 'mongoose'

import AppError from '@/utils/appError'
import httpStatus from 'http-status'

export const updateOne = async (
  model: Model<Document>,
  recordId: string,
  record: Document
): Promise<any> => {
  const updatedRecord = await model.findOneAndUpdate({ _id: recordId }, record, {
    new: true // return the new result instead of the old one
  })

  if (updatedRecord == null) {
    throw new AppError(httpStatus.NOT_FOUND, 'Record not found!')
  }
  return updatedRecord
}
