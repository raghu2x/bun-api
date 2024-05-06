import { Schema } from 'mongoose'
import { enums } from '@/data'
import { generateTemporaryCredentials } from '@/utils/generateCredentials'
import { useDB } from '@/database/connection'

export interface LoginDetail {
  id: string
  password: string
}

const studentSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    batch: {
      type: String
    },
    status: {
      type: String,
      // default: enums.BookStatus.ACTIVE,
      enum: Object.values(enums.BookStatus),
      message: `Invalid status. Allowed values are ${Object.values(enums.BookStatus).join(', ')}.`
    },
    loginDetail: {
      id: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

studentSchema.pre('validate', function (next) {
  // 'this' refers to the current document being saved
  const creds = generateTemporaryCredentials()
  this.loginDetail = creds

  console.log('😎 Student login credentials generated:', this.loginDetail)

  next()
})

const createModel = (tenantId: string) => {
  const conn = useDB(tenantId)
  return conn.model('student', studentSchema)
}

export default { studentSchema, createModel }
