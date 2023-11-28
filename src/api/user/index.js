const express = require('express')
const router = express.Router()
const UserHandler = require('./handler')
const validator = require('../../validator/user')
const UserServices = require('../../services/userServices')
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
    res.status(500).send({
      status: 'Fail',
      message: error.message
    })  
  }
})
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const data = await handler.getTransactionsByUserIdHandler(userId)
    res.status(200)
    res.send(
      {
        status: 'success',
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

router.get('/:userId/:id', async (req, res) => {
  try {
    const { userId, id: transactionId } = req.params
    const data = await handler.getTransactionByIdHandler(userId, transactionId)
    res.status(200)
    res.send(
      {
        status: 'success',
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

router.put('/:userId/:id', async (req, res) => {
  try {
    const { userId, id: transactionId } = req.params
    const payload = req.body
    await handler.putTransactionByIdHandler(userId, transactionId, payload)
    res.status(200)
    res.send(
      {
        status: 'success',
        message: 'Update Transaction Success'
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).send({
      status: 'Fail',
      message: error.message
    })
  }
})
module.exports = router
