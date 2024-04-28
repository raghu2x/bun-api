import { slugify } from 'transliteration'
import fileFilter from './upload.utils'

export interface UploadedFile {
  fileName: string
  size: string
  path: string
  mimeType: string
  fileExtension: string
}

export interface UploadOptions {
  baseDir?: string
  maxFileSize?: number
  accepts?: string
}

const uploadDefaultOptions = {
  baseDir: './src/public/uploads',
  maxFileSize: 5 * 1024 * 1024 // 5mb
}

const getFileExt = (fileName: string) => fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2)

function formatFileSize(bytes: number): string {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB']

  let index = 0
  while (bytes >= 1024 && index < units.length - 1) {
    bytes /= 1024
    index++
  }

  return bytes.toFixed(2) + units[index]
}

interface uploadFileResponse {
  error: false
  // message: string
  file: UploadedFile
}

interface UploadErrorResponse {
  error: true
  message: string
  file: null
}

export const uploadFile = async (
  file: File,
  uploadOptions?: UploadOptions
): Promise<uploadFileResponse | UploadErrorResponse> => {
  try {
    const options: UploadOptions = {
      ...uploadDefaultOptions,
      ...uploadOptions
    }

    if (file instanceof File) {
      if (!options.maxFileSize || options.maxFileSize < file.size) {
        throw new Error('File exceed size limit')
      }

      const isAccepted = fileFilter(file.type, uploadOptions?.accepts)

      if (!isAccepted) {
        throw new Error('File type is not allowed')
      }

      const randomId = Math.random().toString(36).substring(2, 10)

      const _fileName = slugify(file.name)
      const _fileExt = getFileExt(file.name)

      const uploadPath = `/${randomId}_${_fileName}`
      await Bun.write(`${options.baseDir}${uploadPath}`, file)

      const uploadedFile: UploadedFile = {
        fileName: file.name,
        size: formatFileSize(file.size),
        path: uploadPath,
        mimeType: file.type,
        fileExtension: _fileExt
      }

      return {
        error: false,
        // message: 'File uploaded successfully!',
        file: uploadedFile
      }
    }

    throw Error('Invalid File!')
  } catch (error) {
    return { error: true, message: error.message, file: null }
  }
}
