import { sendErrorResponse } from '@/utils/apiResponse'
import { Hono } from 'hono'
import httpStatus from 'http-status'
import path from 'path'
import { serveStatic } from 'hono/bun'

const router = new Hono()

// router.get('/:subPath/:directory/:file', c => {
//   try {
//     const { subPath, directory, file } = c.req.param()

//     const options = {
//       root: path.join(__dirname, `../../public/${subPath}/${directory}`)
//     }

//     const fileName = file

//     return c.sendFile(fileName, options, (error: unknown) => {
//       if (error instanceof Error) {
//         console.log('Can`t find file', error)
//         return sendErrorResponse(c, httpStatus.NOT_FOUND, `We could not find: ${file}`)
//       }
//     })
//   } catch (error: any) {
//     return sendErrorResponse(c, httpStatus.SERVICE_UNAVAILABLE, error.message)
//   }
// })

router.use(
  '/*',
  serveStatic({
    root: './src/public/',
    // rewriteRequestPath: path => path.replace(/^\/files/, ''),
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you access ${c.req.path}`)
    }
  })
)

router.use(
  '/favicon.ico',
  serveStatic({
    path: './src/public/favicon.ico'
  })
)

export default router
