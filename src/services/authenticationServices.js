const AuthenticationError = require('../exceptions/AuthenticationError')
const admin = require('firebase-admin')

const authenticate = async (credential) => {
  try {
    const token = credential.split(' ')[1]
    const decodedToken = await admin.auth().verifyIdToken(token)
    return decodedToken
  } catch (error) {
    throw new AuthenticationError('Unauthorized')
  }
}

module.exports = authenticate
