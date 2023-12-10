const Joi = require('joi')

const postCartPayloadSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().required()
})

const getCartPayloadSchema = Joi.object({
  flowerName: Joi.string().required()
})

const putCartPayloadSchema = Joi.object({
  quantity: Joi.number()
})

module.exports = {
  postCartPayloadSchema,
  getCartPayloadSchema,
  putCartPayloadSchema
}
