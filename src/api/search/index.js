const express = require('express')
const router = express.Router()
const SearchHandler = require('./handler')
const validator = require('../../validator/flowers')
const FlowerServices = require('../../services/flowerServices')
const flowerServices = new FlowerServices()
const handler = new SearchHandler(flowerServices, validator)

router.get('/seller/:sellerId/flowers', async (req, res) => {
  try {
    const { sellerId } = req.params
    const { flowerName } = req.query
    const data = await handler.getSellerFlowerByNameHandler(flowerName, sellerId)
    res.status(200)
    res.send(
      {
        status: 'success',
        message: 'Success get flowers',
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

router.get('/flowers', async (req, res) => {
  try {
    const { flowerName } = req.query
    const data = await handler.getFlowerByNameHandler(flowerName)
    res.status(200)
    res.send(
      {
        status: 'success',
        message: 'Success get flowers',
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
