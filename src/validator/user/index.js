const InvariantError = require('../../exceptions/InvariantError')
const {
  addUserPayloadSchema,
  putUserPayloadSchema
} = require('./schema')

const UserValidator = {
  validatePostUserPayload: (payload) => {
    const dataForValidate = payload
    if (dataForValidate.cover !== undefined) {
      dataForValidate.cover = payload.cover.mimetype
    }    
    const validationResult = addUserPayloadSchema.validate(dataForValidate)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validatePutUserPayload: (payload) => {
    const dataForValidate = payload
    if (dataForValidate.cover !== undefined) {
      dataForValidate.cover = payload.cover.mimetype
    }
    const validationResult = putUserPayloadSchema.validate(dataForValidate)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = UserValidator
