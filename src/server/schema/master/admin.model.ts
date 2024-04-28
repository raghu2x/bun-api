import { InferSchemaType, Model, Schema } from 'mongoose'
import { validate } from '@/utils/validator'
import AppError from '@/utils/appError'
import httpStatus from 'http-status'
import { useDB } from '@/database/connection'
import { Document } from 'mongodb'

const adminUserSchema = new Schema(
  {
    firstName: {
      type: String,
      default: '',
      trim: true,
      required: [true, '{PATH} is required'],
      minLength: 3
    },
    lastName: {
      type: String,
      default: '',
      trim: true,
      required: [true, '{PATH} is required'],
      minLength: [3, 'min 3 characters required']
    },
    email: {
      type: String,
      unique: true,
      required: [true, '{PATH} is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => validate('email').validator(value),
        message: () => validate('email').message
      }
    },
    password: {
      type: String,
      required: [true, '{PATH} is required'],
      select: false,
      validate: {
        validator: (value: string) => validate('password').validator(value),
        message: () => validate('password').message
      }
    },
    address: {
      type: Object,
      default: null
    },
    verified: {
      type: Boolean,
      default: false
    },
    token: { type: String }
  },
  {
    timestamps: true,
    versionKey: false,
    statics: {
      /* ========= find user by email id  ====================== */
      async get(email: string) {
        const user = await this.findOne({ email }).select('+password').exec()

        if (user !== null) {
          return user
        }

        throw new AppError(httpStatus.NOT_FOUND, 'User does not exist')
      }
    }
  }
)

adminUserSchema.virtual('fullName').get(function (this) {
  return `${this.firstName} ${this.lastName}`
})

export type Admin = InferSchemaType<typeof adminUserSchema>

const createModel = (tenantId: string) => {
  return useDB(tenantId).model('admin', adminUserSchema)
}

export default { adminUserSchema, createModel }
