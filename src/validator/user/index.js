const InvariantError = require('../../exceptions/InvariantError')
const {
  addUserSchema
} = require('./schema')

const UserValidator = {
  validatePostUserPayload: (payload) => {
    const dataForValidate = payload
    dataForValidate.cover = payload.cover.mimetype
    const validationResult = addUserSchema.validate(dataForValidate)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = UserValidator
