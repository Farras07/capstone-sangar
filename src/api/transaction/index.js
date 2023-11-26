const express = require('express')
const router = express.Router()
const TransactionHandler = require('./handler')
const validator = require('../../validator/transaction')
const TransactionServices = require('../../services/transactionServices')
const transactionServices = new TransactionServices()
const handler = new TransactionHandler(transactionServices, validator)

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

router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const productsData = req.body
    const data = await handler.postTransactionHandler(userId, productsData)
    res.status(201)
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
module.exports = router
