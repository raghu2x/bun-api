import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'

const router = new Hono()

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
