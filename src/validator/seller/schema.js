const Joi = require('joi')

const postSellerPayloadSchema = Joi.object({
  name: Joi.string().required(),  
  description: Joi.string().required(),
  cover: Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'),
  location: Joi.string().required(),
  location_coordinate: Joi.string().required()
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
  postSellerPayloadSchema
}
