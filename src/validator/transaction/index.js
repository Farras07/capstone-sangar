const InvariantError = require('../../exceptions/InvariantError')
const {
  postTransactionPayloadSchema
} = require('./schema')

const TransactionValidator = {
  validatePostTransactionPayload: (payload) => {
    const validationResult = postTransactionPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}
module.exports = TransactionValidator
