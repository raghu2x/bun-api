import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { bodyLimit } from 'hono/body-limit'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { apiLimiter } from './utils/rateLimiter'
import router from './server/router'

const app = new Hono()

app.use(logger())
app.use(secureHeaders())
app.use(apiLimiter)

app.use(
  bodyLimit({
    maxSize: 5 * 1024 * 1024 // 5mb
  })
)

app.use(
  '/api/*',
  cors({
    origin: ['http://localhost:3001']
  })
)

app.route('/', router)

export default app
