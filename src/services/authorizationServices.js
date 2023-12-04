const AuthorizationError = require('../exceptions/AuthorizationError')
const admin = require('firebase-admin')

const authorize = async (credential) => {
  try {
    const checkRevoked = true
    const token = credential.split(' ')[1]
    const decodedToken = await admin.auth().verifyIdToken(token, checkRevoked)
    return decodedToken
  } catch (error) {
    throw new AuthorizationError('Unauthorized Request')
  }
}

module.exports = authorize
