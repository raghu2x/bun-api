import * as Joi from 'joi'

const create = Joi.object({
  firstName: Joi.string().max(30).required(),
  lastName: Joi.string().max(30).required(),
  batch: Joi.string().required(),
  status: Joi.string().required()
})

export default { create }
