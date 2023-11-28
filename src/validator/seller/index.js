const InvariantError = require('../../exceptions/InvariantError')
const {
  postSellerPayloadSchema
} = require('./schema')

const SellerValidator = {
  validatePostSellerPayload: (payload) => {
    const dataForValidate = payload
    dataForValidate.cover = payload.cover.mimetype
    const validationResult = postSellerPayloadSchema.validate(dataForValidate)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = SellerValidator
