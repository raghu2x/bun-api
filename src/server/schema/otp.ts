import { useDB } from '@/database/connection'
import { Schema } from 'mongoose'

const otpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: Number, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: '1m' }
    }
  },
  { versionKey: false, timestamps: false }
)

const createModel = (tenantId: string) => {
  const conn = useDB(tenantId)
  return conn.model('otp', otpSchema)
}

export default { otpSchema, createModel }
