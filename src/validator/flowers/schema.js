const Joi = require('joi')

const postFlowerPayloadSchema = Joi.object({
  localName: Joi.string(),
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
  flowerName: Joi.string(),
  price: Joi.number(),
  description: Joi.string(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'),
  stock: Joi.number()
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
