const Joi = require('joi')

const postFlowerPayloadSchema = Joi.object({
  flowerName: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'),
  stock: Joi.number().required()
})
const getQueryFlowerPayloadSchema = Joi.object({
  flowerName: Joi.string().required()
})

const putFlowerPayloadSchema = Joi.object({
  price: Joi.number(),
  description: Joi.string(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'),
  stock: Joi.number()
})

module.exports = {
  postFlowerPayloadSchema,
  getQueryFlowerPayloadSchema,
  putFlowerPayloadSchema
}
