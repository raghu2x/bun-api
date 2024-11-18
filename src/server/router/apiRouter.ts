import models from '@/server/schema'
import controller from '@/server/controllers/crudController'
import { Hono } from 'hono'
import verifyToken from '../controllers/coreController/authController/verifyToken'

const router = new Hono()
/* eslint-disable */
// Create dynamic routes for each Mongoose model
Object.keys(models).forEach(modelName => {
  // @ts-expect-error - just ignore it
  const modelGetter = models[modelName].createModel
  console.log('_____❤️  auto crud endpoint:', `${modelName}s`)

  const endpoint = `/${modelName}s`

  // added route authentication
  router.use(`${endpoint}/*`, verifyToken)

  // Get all documents for this model
  router.get(endpoint, controller.getAllRecords(modelGetter))

  // Get a single document by ID
  router.get(`${endpoint}/:id`, controller.getRecordById(modelGetter))

  // Create a new document
  router.post(endpoint, controller.createRecord(modelGetter))

  // Update an existing document by ID
  router.put(`${endpoint}/:id`, controller.updateRecordById(modelGetter))

  // Delete many document by ID
  router.delete(endpoint, controller.deleteManyRecords(modelGetter))

  // Delete a document by ID
  router.delete(`${endpoint}/:id`, controller.deleteRecordById(modelGetter))
})

export default router
