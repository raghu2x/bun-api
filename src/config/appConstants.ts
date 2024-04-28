import { env } from '@/utils/env'

export default {
  API_PORT: env('API_PORT'),
  SOCKET_IO_PORT: Number(env('SOCKET_IO_PORT', '3200')),

  MONGO_URI: env('MONGO_URI'),
  MASTER_DB: env('MASTER_DB')
}
