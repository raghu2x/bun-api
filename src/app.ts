import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { accepts } from 'hono/accepts'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

const app = new OpenAPIHono();

app.openapi(
  createRoute({
    method: 'get',
    path: '/hello',
    responses: {
      200: {
        description: 'Respond a message',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string(),
              email: z.string().email(),
            })
          }
        }
      }
    }
  }),
  (c) => {
    return c.json({
      message: 'hello',
      email:'raghvendra@gmal.com'
    })
  }
)


app.get('/ui', swaggerUI({ url: '/doc' }))
app.doc('/doc', {
  info: {
    title: 'An API',
    version: 'v1'
  },
  openapi: '3.1.0'
})

app.use(logger())
app.use(secureHeaders())

app.use(
  bodyLimit({
    maxSize: 50 * 1024,
  })
);

app.get('/', (c) => {
  const accept = accepts(c, {
    header: 'Accept-Language',
    supports: ['en', 'ja', 'zh'],
    default: 'en',
  })
  return c.json({ lang: accept })
})

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:3001"],
  })
);

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" }, 400);
});

app.get("/notfound", (c) => {
  return c.notFound();
});

export default app;
