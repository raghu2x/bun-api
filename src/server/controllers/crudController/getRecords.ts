import { type Query, type PaginationQuery, queryBuilder } from '@/utils/helper'
import { type Document, type Model } from 'mongoose'

import AppError from '@/utils/appError'
import httpStatus from 'http-status'
import APIFeatures from '@/utils/apiFeature'

interface AllRecordsReturn {
  totalRecords: number
  records: Document[]
  pagination: PaginationQuery
}

export const getAll = async (
  model: Model<Document>,
  queryParams: Query
): Promise<AllRecordsReturn> => {
  // 1. parse search query
  const searchQuery = queryBuilder(queryParams.search)

  // 2. use APIFeature for model
  const recordsPromise = new APIFeatures(model.find({ ...searchQuery }), queryParams)
    .sort()
    .paginate()

  // 3. get total count for document
  const totalRecordsPromise = model.countDocuments({ ...searchQuery })

  // 4.  fetch data from db
  const [records, totalRecords] = await Promise.all([recordsPromise.query, totalRecordsPromise])

  const allRecords = {
    pagination: recordsPromise.pagination,
    totalRecords,
    records
  }

  return allRecords
}

export const getOne = async (model: Model<Document>, recordId: string): Promise<any> => {
  const oneRecord = await model.findOne({ _id: recordId })

  if (oneRecord == null) {
    throw new AppError(httpStatus.NOT_FOUND, 'Record not found!')
  }

  return oneRecord
}
