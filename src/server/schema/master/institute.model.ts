import { Schema, InferSchemaType } from 'mongoose'
import { enums } from '@/data'
import httpStatus from 'http-status'
import AppError from '@/utils/appError'
import { useDB } from '@/database/connection'

const instituteSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    schoolId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      // default: enums.BookStatus.ACTIVE,
      enum: Object.values(enums.BookStatus),
      message: `Invalid status. Allowed values are ${Object.values(enums.BookStatus).join(', ')}.`
    }
  },
  { timestamps: true, versionKey: false }
)

export type Institute = InferSchemaType<typeof instituteSchema>

instituteSchema.statics.get = async function (email: string): Promise<Institute | null> {
  const institute: Institute | null = await this.findOne({ email }).select('+password').exec()

  if (institute !== null) {
    return institute
  }

  throw new AppError(httpStatus.NOT_FOUND, 'Institute does not exist')
}

const createModel = (tenantId: string) => {
  const conn = useDB(tenantId)
  return conn.model('institute', instituteSchema)
}

export default { instituteSchema, createModel }
