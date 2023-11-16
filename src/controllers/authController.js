const admin = require('firebase-admin')
const serviceAccount = require('../../firebase-admin-key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

exports.signup = async (req, res) => {
  const user = {
    email: req.body.email,
    passord: req.body.password
  }

  try {
    const userRecord = await admin.auth().createUser({
      email: user.email,
      password: user.passord,
      emailVerified: false,
      disabled: false
    })
    res.status(200).json({ message: 'User Created', userRecord })
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' })
  }
}

exports.login = async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  try {
    const userRecord = await admin.auth().getUserByEmail(user.email)
    res.status(200).json({ message: 'Masuk Berhasil', userRecord })
  } catch (error) {
    res.status(500).json({ error: 'Gagal Saat Masuk' })
  }
}
exports.logout = async (req, res) => {
  const token = req.headers.authorization

  try {
    await admin.auth().revokeRefreshTokens(token)
    res.status(200).json({ message: 'Logout Berhasil' })
  } catch (error) {
    res.status(500).json({ error: 'Gagal Saat Logout' })
  }
}
