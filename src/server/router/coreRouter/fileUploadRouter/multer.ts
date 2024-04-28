import { sendSuccessResponse } from '@/utils/apiResponse'
import { type CustomRequestHandler } from '@/types/common'

export const uploadFiles: CustomRequestHandler = (c, next) => {
  console.log('req body', c.body)
  console.log('upload file', c.upload)

  // @ts-expect-error -ddd
  return sendSuccessResponse(c, c.upload)
}
