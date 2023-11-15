const InvariantError = require('../../exceptions/InvariantError')
const {
  postFlowerPayloadSchema,
  getQueryFlowerPayloadSchema,
  putFlowerPayloadSchema
} = require('./schema')

const FlowersValidator = {
  validatePostFlowerPayload: (payload) => {
    const dataForValidate = payload
    dataForValidate.cover = payload.cover.mimetype
    const validationResult = postFlowerPayloadSchema.validate(dataForValidate)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validatePutFlowerPayload: (payload) => {
    const validationResult = putFlowerPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateQueryFlowerPayload: (payload) => {
    const validationResult = getQueryFlowerPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = FlowersValidator
