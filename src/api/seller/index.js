const express = require('express')
const router = express.Router()
const multer = require('multer')
const validator = require('../../validator/flowers')
const SellerHandler = require('./handler')
const upload = multer()// Create a multer instance

const handler = new SellerHandler(validator)

router.get('/:sellerId/flowers', async (req, res) => {
  try {
    const data = await handler.getSellerFlowersHandler(req.params.sellerId)
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

router.get('/:sellerId/flowers/:id', async (req, res) => {
  try {
    const { id, sellerId } = req.params
    const data = await handler.getSellerFlowerByIdHandler(id, sellerId)
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

router.post('/:sellerId/flowers', upload.single('cover'), async (req, res) => {
  try {
    const { sellerId } = req.params
    req.body.cover = req.file

    const id = await handler.addSellerFlowerHandler(req.body, sellerId)
    
    res.status(201)
    res.send({
      status: 'success',
      message: 'Flower added',
      data: {
        id
      }
    })
  } catch (error) {
    res.status(error.statusCode || 500).send({
      status: 'Fail',
      message: error.message
    })
  }
})
router.put('/:sellerId/flowers/:id', upload.single('cover'), async (req, res) => {
  try {
    const { sellerId, id: flowerId } = req.params
    if (req.file !== undefined) {
      req.body.cover = req.file
    }
    if (!Array.isArray(req.body.varian) && req.body.varian !== undefined) req.body.varian = [req.body.varian]
    if (!Array.isArray(req.body.category) && req.body.category !== undefined) req.body.category = [req.body.category]
    
    await handler.updateSellerFlowerHandler(req.body, sellerId, flowerId)

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

router.delete('/:sellerId/flowers/:id', async (req, res) => {
  try {
    const { sellerId, id: flowerId } = req.params
    await handler.deleteSellerFlowerHandler(sellerId, flowerId)
    res.status(200)
    res.send({
      status: 'success',
      message: 'Flower Successfully Deleted'
    })
  } catch (error) {
    res.status(error.statusCode || 500).send({
      status: 'Fail',
      message: error.message
    })
  }
})
module.exports = router
