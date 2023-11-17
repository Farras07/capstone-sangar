// eslint-disable-next-line no-unused-vars
const admin = require('firebase-admin')

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization

  try {
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

module.exports = authenticate
