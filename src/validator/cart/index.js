const InvariantError = require('../../exceptions/InvariantError')
const {
  postCartPayloadSchema,
  getCartPayloadSchema,
  putCartPayloadSchema
} = require('./schema')

const CartValidator = {
  validatePostCartPayload: (payload) => {
    try {
      postCartPayloadSchema.validate(payload)
    } catch (error) {
      throw new InvariantError('Invalid payload: ' + error.message)
    }
  },

  validatePutCartPayload: (payload) => {
    try {
      putCartPayloadSchema.validate(payload)
    } catch (error) {
      throw new InvariantError('Invalid payload: ' + error.message)
    }
  },

  validateQueryCartPayload: (payload) => {
    try {
      getCartPayloadSchema.validate(payload)
    } catch (error) {
      throw new InvariantError('Invalid payload: ' + error.message)
    }
  }
}

module.exports = CartValidator
