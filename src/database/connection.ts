import { env, envOrFail } from '@/utils/env'
import mongoose, { type Connection, type ConnectOptions, Schema } from 'mongoose'

mongoose.set({
  id: true,
  // autoCreate: true,
  // strictPopulate: false,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id
    }
  }
})

const clientOption: ConnectOptions = {
  socketTimeoutMS: 30000
  // family: 4
}

interface ConnectionInfo {
  uri: string
  connection: Connection
}

const connections: ConnectionInfo[] = []

const connectToDatabase = (dbName: string): Connection => {
  try {
    const uri = `${envOrFail('MONGO_URI')}/${dbName}`
    const existingConnection = connections.find(conn => conn.uri === uri)

    if (existingConnection?.connection !== undefined) {
      return existingConnection.connection
    }

    const newConnection = mongoose.createConnection(uri, clientOption)

    connections.push({ uri, connection: newConnection })
    console.log(`Connected to the database: ${uri}`)

    return newConnection
  } catch (error) {
    console.error(`Error connecting to the database: ${dbName}`, error)
    throw error
  }
}

// Additional function to connect to the school database
export const useMasterDB = (): Connection => {
  return connectToDatabase('master_database')
}

export const useDB = (dbName: string): Connection => {
  const mongoConnection = connectToDatabase(dbName)
  return mongoConnection
}

// export const createModel = (db: Connection, modelName: string, modelSchema): Model<Document> => {
//   return db.model(modelName, modelSchema) as Model<Document>
// }

export const getModelByTenant = <T = any>(
  tenantId: string,
  modelName: string,
  modelSchema: Schema
) => {
  const conn = connectToDatabase(tenantId)
  return conn.model(modelName, modelSchema)
}
