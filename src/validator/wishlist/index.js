const InvariantError = require('../../exceptions/InvariantError')
const {
  postWishlistPayloadSchema
} = require('./schema')

const WishlistValidator = {
  validatePostWishlistPayload: (payload) => {
    const validationResult = postWishlistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}
module.exports = WishlistValidator
