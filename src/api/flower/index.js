const express = require('express')
const router = express.Router()
const FlowerHandler = require('./handler')
const validator = require('../../validator/flowers')
const FlowerServices = require('../../services/flowerServices')
const flowerServices = new FlowerServices()
const handler = new FlowerHandler(flowerServices, validator)

router.get('/', async (req, res) => {
  try {
    const data = await handler.getFlowersHandler()
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
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = await handler.getFlowerByIdHandler(id)
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
