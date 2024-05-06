import { handleErrors, sendErrorResponse, sendSuccessResponse } from '@/utils/apiResponse'
import { uploadFile } from '@/utils/uploader/uploadFile'
import { Hono } from 'hono'
import httpStatus from 'http-status'
import { unlink } from 'node:fs/promises'

const fileUploadRouter = new Hono()

fileUploadRouter.post('/upload-file', async ctx => {
  const body = await ctx.req.parseBody()

  const file = body['file']

  if (file instanceof File) {
    const uploadedFile = await uploadFile(file, { accepts: 'image' })

    if (uploadedFile.error) {
      return sendErrorResponse(ctx, httpStatus.BAD_REQUEST, uploadedFile.message)
    }
    return ctx.json(uploadedFile.file)
  }

  return sendErrorResponse(ctx, httpStatus.BAD_REQUEST, 'File is not a valid blob')
})

fileUploadRouter.delete('/delete-files', async c => {
  try {
    const filePaths = c.req.queries('filePaths')

    if (!filePaths) return c.text('filePaths is required', httpStatus.BAD_REQUEST)

    const path = filePaths[0]

    await unlink(`./src/public/uploads${path}`)

    return sendSuccessResponse(c, null, httpStatus.OK, 'Files removed successfully')
  } catch (error) {
    return handleErrors(c, error)
  }
})

export default fileUploadRouter
