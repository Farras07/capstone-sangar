const express = require('express')
const router = express.Router()
const multer = require('multer')
const validator = require('../../validator/flowers')
const SellerHandler = require('./handler')
const upload = multer()// Create a multer instance

const handler = new SellerHandler(validator)

router.get('/:sellerId/flowers', async (req, res) => {
  try {
    res.status(200)
    res.send(await handler.getSellerFlowersHandler(req.params.sellerId))
  } catch (error) {
    res.status(error)
    res.send(error)
  }
  await res.send('halo')
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
    res.status(error)
    res.send(error)
  }
})
router.put('/:sellerId/flowers/:id', upload.single('cover'), async (req, res) => {
  const { sellerId, id: flowerId } = req.params
  req.body.cover = req.file
  const id = await handler.updateSellerFlowerHandler(req.body, sellerId, flowerId)
})
module.exports = router
