const Joi = require('joi')

const postWishlistPayloadSchema = Joi.object({
  productId: Joi.string().required()
})

module.exports = {
  postWishlistPayloadSchema
}
