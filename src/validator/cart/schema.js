const Joi = require('joi')

const postCartPayloadSchema = Joi.object({
  flowerName: Joi.string().required(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  totalPrice: Joi.number().required()
})

const getCartPayloadSchema = Joi.object({
  flowerName: Joi.string().required()
})

const putCartPayloadSchema = Joi.object({
  flowerName: Joi.string().required(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  totalPrice: Joi.number().required()
})

module.exports = {
  postCartPayloadSchema,
  getCartPayloadSchema,
  putCartPayloadSchema
}
