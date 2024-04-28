import { Hono } from 'hono'
import { uploadFiles } from './multer'
import { singleStorageUpload } from '@/server/middlewares/uploadMiddleware'

const router = new Hono()

router.use(
  '/upload-file',
  singleStorageUpload({ entity: 'setting', fieldName: 'photo', fileType: 'image' }),
  uploadFiles
)
router.use(
  '/upload-pdf',
  singleStorageUpload({ entity: 'setting', fieldName: 'file', fileType: 'pdf' }),
  uploadFiles
)

export default router
