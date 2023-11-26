const Joi = require('joi')

const postTransactionPayloadSchema = Joi.object({
  products: Joi.array().items(
    Joi.object({
      id: Joi.string().required(), 
      flowerName: Joi.string().required(),
      price: Joi.number().required(),
      varian: Joi.string().required(),
      quantity: Joi.number().required()
    })
  ).required()
})

// const getSellerFlowerByIdSchema = Joi.object({
//   id: Joi.string().required(),
//   sellerId: Joi.object().required()
// })

module.exports = {
  postTransactionPayloadSchema
}
