const express = require('express')
const router = express.Router()
const FlowerHandler = require('./handler')
const validator = require('../../validator/flowers')
const FlowerServices = require('../../services/flowerServices')
const flowerServices = new FlowerServices()
const handler = new FlowerHandler(flowerServices, validator)
const multer = require('multer')
const upload = multer()

router.get('/', async (req, res) => {
  try {
    const data = await handler.getFlowersHandler()
    res.status(200).json(
      {
        status: 'success',
        message: 'Success get flowers',
        data
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = await handler.getFlowerByIdHandler(id)
    res.status(200).json(
      {
        status: 'success',
        message: 'Success get flower',
        data
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})

router.post('/predict', upload.single('image'), async (req, res) => {
  try {
    const data = await handler.predictFlower(req.file)
    res.status(200).json(
      {
        status: 'success',
        message: 'Success get flower',
        data
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
