const Joi = require('joi')

const addUserPayloadSchema = Joi.object({
  fullname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  address: Joi.string().required(),
  location_coordinate: Joi.string(),
  contact: Joi.string().required(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp')
})

const putUserPayloadSchema = Joi.object({
  fullname: Joi.string(),
  username: Joi.string(),
  address: Joi.string(),
  location_coordinate: Joi.string(),
  contact: Joi.string(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp')
})
module.exports = {
  addUserPayloadSchema,
  putUserPayloadSchema
}
