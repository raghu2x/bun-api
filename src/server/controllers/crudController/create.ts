import { type Model, type Document } from 'mongoose'

export const create = async (model: Model<Document>, record: any): Promise<any> => {
  const createdRecord = await model.create({ ...record })
  return createdRecord
}
