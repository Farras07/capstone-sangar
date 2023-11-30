const express = require('express')
const router = express.Router()
const UserHandler = require('./handler')
const validator = require('../../validator/user')
const UserServices = require('../../services/userServices')
const AuthenticationServices = require('../../services/authenticationServices')

const userServices = new UserServices()
const handler = new UserHandler(userServices, validator)
const multer = require('multer')
const upload = multer()

router.post('/', upload.single('cover'), async (req, res) => {
  try {
    const image = req.file
    req.body.cover = req.file
    const userId = await handler.postUserHandler(req.body, image)
    res.status(201).json({ message: 'User Created', id: userId })
  } catch (error) {
    res.status(500 || error.statusCode).send({
      status: 'Fail',
      message: error.message
    })  
  }
})

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthenticationServices(token)
    const { uid: userId } = decodedToken
    console.log(userId)
    const data = await handler.getUserByUserIdHandler(userId)
    res.status(200)
    res.send(
      { 
        status: 'success',
        message: 'Success get user',
        data
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).send({
      status: 'Fail',
      message: error.message
    })
  }
})

router.put('/', upload.single('cover'), async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthenticationServices(token)
    const { uid: userId, email } = decodedToken
    console.log(decodedToken)
    
    if (req.file !== undefined) {
      req.body.cover = req.file
    }
    
    await handler.updateUserHandler(req.body, userId, email)

    res.status(200)
    res.send({
      status: 'success',
      message: 'Flower Successfully Updated'
    })
  } catch (error) {
    res.status(error.statusCode || 500).send({
      status: 'Fail',
      message: error.message
    })
  }
})
module.exports = router
