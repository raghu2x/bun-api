import { type InferSchemaType, Schema } from 'mongoose'
import { validate } from '@/utils/validator'
import { generateTemporaryCredentials } from '@/utils/generateCredentials'
import { useDB } from '@/database/connection'

export interface LoginDetail {
  id: string
  password: string
}

const userSchema = new Schema(
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
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => validate('email').validator(value),
        message: () => validate('email').message
      }
    },
    address: {
      type: Object,
      default: null
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
    versionKey: false,
    virtuals: {
      fullName: {
        get() {
          return `${this.firstName} ${this.lastName}`
        }
      }
    }
  }
)

export type IUser = InferSchemaType<typeof userSchema>

userSchema.pre('validate', function (next) {
  // 'this' refers to the current document being saved
  const creds = generateTemporaryCredentials()

  this.loginDetail = creds

  console.log('😎 Staff login credentials generated:', this.loginDetail)

  next()
})

export class UserModel {
  private static readonly userSchema = userSchema

  public static createModel = (tenantId: string) => {
    const conn = useDB(tenantId)
    return conn.model('student', UserModel.userSchema)
  }
}
