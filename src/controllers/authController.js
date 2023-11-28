/* eslint-disable no-underscore-dangle */
const admin = require('../config/firebaseAdmin')
const { getAuth, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } = require('firebase/auth')
const app = require('../config/firebaseConfig')
const UserServices = require('../services/userServices')

const userServices = new UserServices()
const auth = getAuth(app)

// exports.signup = async (req, res) => {
//   try {
//     const image = req.file
//     req.body.cover = req.file
//     await validator.validatePostUserPayload(req.body)
//     const userRecord = await admin.auth().createUser({
//       displayName: req.body.username,
//       email: req.body.email,
//       password: req.body.password,
//       // phoneNumber: req.body.contact,
//       emailVerified: true,
//       disabled: false
//     })
//     const filename = `${userRecord.uid}_${image.originalname}`
//     const buffer = image.buffer
//     const file = await userServices.uploadUserImage(filename, buffer)
//     const imageUrl = `${process.env.GS_URL_USER}/${file}`

//     await admin.auth().updateUser(userRecord.uid, {
//       photoURL: imageUrl 
//     })

//     const user = {
//       id: userRecord.uid,
//       fullname: req.body.fullname,
//       username: req.body.username,
//       email: req.body.email,
//       address: req.body.address,
//       location_coordinate: req.body.location_coordinate,
//       contact: req.body.contact,
//       cart: [],
//       image: imageUrl,
//       isSeller: false
//     }
//     await userServices.addUser(user)
//     res.status(200).json({ message: 'User Created', id: user.id })
//   } catch (error) {
//     res.status(500).send({
//       status: 'Fail',
//       message: error.message
//     })  
//   }
// }
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
    const userProfle = await userServices.getUserById(signInResponse.user.uid)
    console.log('profile')
    console.log(userProfle)
    const credential = await signInResponse.user.getIdToken()
    res.status(200).json({ message: 'Masuk Berhasil', credential })
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

exports.resetPassword = async (req, res) => {
  const email = req.body.email
  try {
    const response = await sendPasswordResetEmail(auth, email)
    res.status(200).json({ message: 'Link has been sent to your email', response })
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
