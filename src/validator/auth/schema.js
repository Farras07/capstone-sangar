const Joi = require('joi')

const addUserSchema = Joi.object({
  fullname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  address: Joi.string().required(),
  location_coordinate: Joi.string(),
  contact: Joi.string().required()
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})
// const getSellerFlowerByIdSchema = Joi.object({
//   id: Joi.string().required(),
//   sellerId: Joi.object().required()
// })

module.exports = {
  addUserSchema,
  loginSchema
}
