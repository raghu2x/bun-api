import multer, { type StorageEngine } from 'multer'
import path from 'path'
import { slugify } from 'transliteration'
import fileFilter from './upload.utils'

interface SingleStorageUploadOptions {
  entity: string
  fileType?: string
  fieldName?: string
}

const singleStorageUpload = ({
  entity,
  fileType = 'default',
  fieldName = 'file'
}: SingleStorageUploadOptions) => {
  const diskStorage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `src/public/uploads/${entity}`)
    },
    filename: (req, file, cb) => {
      try {
        // fetching the file extension of the uploaded file
        const fileExtension = path.extname(file.originalname)
        const uniqueFileID = Math.random().toString(36).slice(2, 7) // generates unique ID of length 5

        // convert any language to English characters
        const originalname = slugify(file.originalname.split('.')[0].toLocaleLowerCase())

        const _fileName = `${originalname}-${uniqueFileID}${fileExtension}`

        const filePath = `/uploads/${entity}/${_fileName}`
        // saving file name and extension in the request upload object
        // @ts-expect-error -ddd
        req.upload = {
          fileName: _fileName,
          fieldExt: fileExtension,
          entity,
          fieldName,
          fileType,
          filePath
        }

        req.body[fieldName] = filePath

        cb(null, _fileName)
      } catch (error: unknown) {
        if (error instanceof Error || error === null) {
          cb(error, __filename) // pass the error to the callback
        }
      }
    }
  })

  const filterType = fileFilter(fileType)

  const multerStorage = multer({ storage: diskStorage, fileFilter: filterType }).single('file')
  return multerStorage
}

export default singleStorageUpload
