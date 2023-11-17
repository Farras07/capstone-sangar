const Joi = require('joi')

const postFlowerPayloadSchema = Joi.object({
  flowerName: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'),
  stock: Joi.number().required(),
  varian: Joi.array().items(Joi.string()).required(),
  category: Joi.array().items(Joi.string()).required()
})
const getQueryFlowerPayloadSchema = Joi.object({
  flowerName: Joi.string().required()
})

const putFlowerPayloadSchema = Joi.object({
  flowerName: Joi.string(),
  price: Joi.number(),
  description: Joi.string(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'),
  stock: Joi.number(),
  varian: Joi.array().items(Joi.string()),
  category: Joi.array().items(Joi.string())
})

// const getSellerFlowerByIdSchema = Joi.object({
//   id: Joi.string().required(),
//   sellerId: Joi.object().required()
// })

module.exports = {
  postFlowerPayloadSchema,
  getQueryFlowerPayloadSchema,
  putFlowerPayloadSchema
}
