/* eslint-disable no-underscore-dangle */
const admin = require('../config/firebaseAdmin')
const { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } = require('firebase/auth')
const app = require('../config/firebaseConfig')
const UserServices = require('../services/userServices')
const AuthenticationServices = require('../services/authenticationServices')
const AuthenticationError = require('../exceptions/AuthenticationError')

const userServices = new UserServices()
const auth = getAuth(app)

exports.login = async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  try {
    const signInResponse = await signInWithEmailAndPassword(auth, user.email, user.password)
    const userProfle = await userServices.getUserById(signInResponse.user.uid)
    console.log('profile')
    console.log(userProfle)
    const credential = await signInResponse.user.getIdToken(true)
    res.status(200).json({ status: 'success', message: 'Masuk Berhasil', credential })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
exports.logout = async (req, res) => {
  const token = req.headers.authorization
  const decodedToken = await AuthenticationServices(token)
  const { uid: userId } = decodedToken
  try {
    await admin.auth().revokeRefreshTokens(userId)
    res.status(200).json({ status: 'success', message: 'Logout Berhasil' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'fail', error: 'Gagal Saat Logout' })
  }
}

exports.resetPassword = async (req, res) => {
  const email = req.body.email
  try {
    const response = await sendPasswordResetEmail(auth, email)
    res.status(200).json({ status: 'success', message: 'Link has been sent to your email', response })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.refreshAccessToken = async (req, res) => {
  try {
    const { userId } = req.body
    const user = await admin.auth().getUser(userId)
    const refreshToken = user.tokensValidAfterTime
  
    const currentTimestamp = Date.now()
    const refreshThreshold = 60 * 60 * 1000 // 1 hour in milliseconds
  
    if (currentTimestamp - refreshToken > refreshThreshold) {
      console.log('Refresh token has expired or is not valid anymore.')
      throw new AuthenticationError('Refresh token has expired or is not valid anymore.')
    }

    const customToken = await admin.auth().createCustomToken(userId)
    // const signInResponse = await admin.auth().signInWithCustomToken(customToken)

    res.status(201).json({ status: 'success', message: 'Refreshing Access Token Success', credential: customToken })
  } catch (error) {
    res.status(500).json({ status: 'fail', error: error.message })
  }
}
