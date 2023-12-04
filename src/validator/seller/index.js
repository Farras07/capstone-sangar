const InvariantError = require('../../exceptions/InvariantError')
const {
  postSellerPayloadSchema,
  putSellerPayloadSchema
} = require('./schema')

const SellerValidator = {
  validatePostSellerPayload: (payload) => {
    const dataForValidate = payload
    if (dataForValidate.cover !== undefined) {
      dataForValidate.cover = payload.cover.mimetype
    }
    const validationResult = postSellerPayloadSchema.validate(dataForValidate)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validatePutSellerPayload: (payload) => {
    const dataForValidate = payload
    if (dataForValidate.cover !== undefined) {
      dataForValidate.cover = payload.cover.mimetype
    }    
    const validationResult = putSellerPayloadSchema.validate(dataForValidate)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = SellerValidator
