const InvariantError = require('../../exceptions/InvariantError')
const {
  postCartPayloadSchema,
  getCartPayloadSchema,
  putCartPayloadSchema
} = require('./schema')

const CartValidator = {
  validatePostCartPayload: (payload) => {
    try {
      const dataForValidate = {
        ...payload,
        cover: payload.cover.mimetype
      }
      postCartPayloadSchema.validate(dataForValidate)
    } catch (error) {
      throw new InvariantError('Invalid payload: ' + error.message)
    }
  },

  validatePutCartPayload: (payload) => {
    try {
      if (payload.cover !== undefined) {
        payload.cover = payload.cover.mimetype
      }
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
