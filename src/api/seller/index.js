const express = require('express')
const router = express.Router()
const multer = require('multer')
const validator = require('../../validator/seller')
const SellerHandler = require('./handler')
const upload = multer()
const AuthenticationServices = require('../../services/authenticationServices')
const SellerServices = require('../../services/sellerServices')
const sellerServices = new SellerServices()
const handler = new SellerHandler(validator, sellerServices)

router.post('/', upload.single('cover'), async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthenticationServices(token)
    const { uid: credentialId } = decodedToken
    req.body.cover = req.file
    const sellerId = await handler.postSellerHandler(credentialId, req.body)

    res.status(201)
    res.send({
      status: 'success',
      message: 'Seller Registered',
      data: {
        sellerId
      }
    })
  } catch (error) {
    res.status(error.statusCode || 500).send({
      status: 'Fail',
      message: error.message
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthenticationServices(token)
    const { uid: ownerId } = decodedToken
    console.log(ownerId)
    const data = await handler.getSellerByOwnerIdHandler(ownerId)
    res.status(200)
    res.send(
      { 
        status: 'success',
        message: 'Success get seller',
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

router.get('/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params
    const data = await handler.getSellerByIdHandler(sellerId)
    res.status(200)
    res.send(
      { 
        status: 'success',
        message: 'Success get seller',
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

router.post('/flowers', upload.single('cover'), async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthenticationServices(token)
    const { uid: ownerId } = decodedToken
    req.body.cover = req.file

    const id = await handler.addSellerFlowerHandler(req.body, ownerId)
    
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
router.put('/flowers/:id', upload.single('cover'), async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthenticationServices(token)
    const { uid: ownerId } = decodedToken

    const { id: flowerId } = req.params
    
    if (req.file !== undefined) {
      req.body.cover = req.file
    }
    if (!Array.isArray(req.body.varian) && req.body.varian !== undefined) req.body.varian = [req.body.varian]
    if (!Array.isArray(req.body.category) && req.body.category !== undefined) req.body.category = [req.body.category]
    
    await handler.updateSellerFlowerHandler(req.body, ownerId, flowerId)

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

router.delete('/flowers/:id', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthenticationServices(token)
    const { uid: ownerId } = decodedToken

    const { id: flowerId } = req.params
    await handler.deleteSellerFlowerHandler(ownerId, flowerId)
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
