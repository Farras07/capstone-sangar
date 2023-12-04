const Joi = require('joi')

const addUserPayloadSchema = Joi.object({
  fullname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  address: Joi.string().required(),
  locationLatitude: Joi.number(),
  locationLongitude: Joi.number(),
  contact: Joi.string().required(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp')
})

const putUserPayloadSchema = Joi.object({
  fullname: Joi.string(),
  username: Joi.string(),
  address: Joi.string(),
  locationLatitude: Joi.number(),
  locationLongitude: Joi.number(),
  contact: Joi.string(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp')
})
module.exports = {
  addUserPayloadSchema,
  putUserPayloadSchema
}
