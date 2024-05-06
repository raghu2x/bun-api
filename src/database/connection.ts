import { envOrFail } from '@/utils/env'
import mongoose, { type Connection, type ConnectOptions } from 'mongoose'

mongoose.set({
  id: true,
  // autoCreate: true,
  // strictPopulate: false,
  toJSON: {
    virtuals: true,
    transform: function (_doc, ret) {
      delete ret['_id']
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
