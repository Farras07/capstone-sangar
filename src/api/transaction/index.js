const express = require('express')
const router = express.Router()
const TransactionHandler = require('./handler')
const validator = require('../../validator/transaction')
const TransactionServices = require('../../services/transactionServices')
const AuthorizationServices = require('../../services/authorizationServices')

const transactionServices = new TransactionServices()
const handler = new TransactionHandler(transactionServices, validator)

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: userId } = decodedToken

    const data = await handler.getTransactionsByUserIdHandler(userId)
    res.status(200).json(
      {
        status: 'success',
        data: {
          transactions: [data]
        }
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).send({
      status: 'Fail',
      message: error.message
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id: transactionId } = req.params
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: userId } = decodedToken
    
    const data = await handler.getTransactionByIdHandler(userId, transactionId)
    res.status(200).json(
      {
        status: 'success',
        data: {
          transaction: data
        }
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { id: transactionId } = req.params
    const payload = req.body
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: userId } = decodedToken

    await handler.putTransactionByIdHandler(userId, transactionId, payload)
    res.status(200).json(
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

router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: userId } = decodedToken
    const data = await handler.postTransactionHandler(userId)
    res.status(201).json(
      {
        status: 'success',
        message: 'Order Success',
        data: {
          id: data
        }
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})
module.exports = router
