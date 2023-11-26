const InvariantError = require('../../exceptions/InvariantError')
const {
  addUserSchema,
  loginSchema
} = require('./schema')

const AuthValidator = {
  validatePostUserPayload: (payload) => {
    const validationResult = addUserSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateLoginPayload: (payload) => {
    const validationResult = loginSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = AuthValidator
