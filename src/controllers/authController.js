/* eslint-disable no-underscore-dangle */
const admin = require('firebase-admin')
const serviceAccount = require('../../firebase-admin-key.json')
const { getAuth, signInWithEmailAndPassword, signOut } = require('firebase/auth')
const app = require('../config/firebaseConfig')
const db = require('../db')
const validator = require('../validator/auth')

const auth = getAuth(app)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

exports.signup = async (req, res) => {
  try {
    await validator.validatePostUserPayload(req.body)
    const user = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      passord: req.body.password,
      address: req.body.address,
      contact: req.body.contact
    }
    const userRecord = await admin.auth().createUser({
      email: user.email,
      password: user.passord,
      emailVerified: true,
      disabled: false
    })
    res.status(200).json({ message: 'User Created', userRecord })
  } catch (error) {
    res.status(500).send({
      status: 'Fail',
      message: error.message
    })  
  }
}
// exports.signup = async (req, res) => {
//   try {
//     // await validator.validatePostUserPayload(req.body)
//     const user = {
//       email: req.body.email,
//       passord: req.body.password
//     }
//     const userRecord = await admin.auth().createUser({
//       email: user.email,
//       password: user.passord,
//       emailVerified: false,
//       disabled: false
//     })
//     res.status(200).json({ message: 'User Created', userRecord })
//   } catch (error) {
//     res.status(500).json({ status: 'fail', message: error.message })
//   }
// }

exports.login = async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  try {
    const signInResponse = await signInWithEmailAndPassword(auth, user.email, user.password)
    const credential = await signInResponse.user.getIdToken()
    res.status(200).json({ message: 'Masuk Berhasil', accessToken: credential })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
// exports.login = async (req, res) => {
//   const user = {
//     email: req.body.email,
//     password: req.body.password
//   }
//   try {
//     const userRecord = await admin.auth().getUserByEmail(user.email)
//     console.log(userRecord)
//     res.status(200).json({ message: 'Masuk Berhasil', userRecord })
//   } catch (error) {
//     res.status(500).json({ error: 'Gagal Saat Masuk' })
//   }
// }
exports.logout = async (req, res) => {
  try {
    console.log('before')
    const response = await signOut(auth)
    console.log('after')
    console.log(auth.currentUser)
    res.status(200).json({ message: 'logout Berhasil', response })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
// exports.logout = async (req, res) => {
//   const token = req.headers.authorization

//   try {
//     await admin.auth().revokeRefreshTokens(token)
//     res.status(200).json({ message: 'Logout Berhasil' })
//   } catch (error) {
//     res.status(500).json({ error: 'Gagal Saat Logout' })
//   }
// }
