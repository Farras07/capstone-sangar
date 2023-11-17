const express = require('express')
const router = express.Router()
const FlowerHandler = require('./handler')
const validator = require('../../validator/flowers')
const FlowerServices = require('../../services/flowerServices')
const flowerServices = new FlowerServices()
const handler = new FlowerHandler(flowerServices, validator)

router.get('/', async (req, res) => {
  try {
    res.status(200)
    res.send(await handler.getFlowersHandler())
  } catch (error) {
    res.status(500)
    res.send({
      status: 'Fail',
      message: error
    })
  }
})
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params.id
    res.status(200)
    res.send(await handler.getFlowerByIdHandler(id))
  } catch (error) {
    res.status(500)
    res.send({
      status: 'Fail',
      message: error
    })
  }
})
module.exports = router
