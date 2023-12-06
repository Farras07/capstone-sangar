const AuthenticationError = require('../exceptions/AuthenticationError')
const admin = require('firebase-admin')

const authenticate = async (credential) => {
  try {
    const checkRevoked = true
    const token = credential.split(' ')[1]
    const decodedToken = await admin.auth().verifyIdToken(token, checkRevoked)
    return decodedToken
  } catch (error) {
    throw new AuthenticationError('Unauthenticate')
  }
}

module.exports = authenticate
