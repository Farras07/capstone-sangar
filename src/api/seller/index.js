const express = require('express')
const router = express.Router()
const multer = require('multer')
const validator = require('../../validator/seller')
const SellerHandler = require('./handler')
const upload = multer()
const AuthorizationServices = require('../../services/authorizationServices')
const SellerServices = require('../../services/sellerServices')
const sellerServices = new SellerServices()
const handler = new SellerHandler(validator, sellerServices)

router.post('/', upload.single('cover'), async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: credentialId } = decodedToken
    if (req.file) req.body.cover = req.file
    const sellerId = await handler.postSellerHandler(credentialId, req.body)

    res.status(201).json({
      status: 'success',
      message: 'Seller Registered',
      data: {
        sellerId
      }
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: ownerId } = decodedToken
    const data = await handler.getSellerByOwnerIdHandler(ownerId)
    res.status(200).json(
      { 
        status: 'success',
        message: 'Success get seller',
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

router.get('/all', async (req, res) => {
  try {
    const data = await handler.getAllSellerFlowersHandler()
    res.status(200).json(
      { 
        status: 'success',
        message: 'Success get sellers',
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

router.get('/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params
    const data = await handler.getSellerByIdHandler(sellerId)
    res.status(200).json(
      { 
        status: 'success',
        message: 'Success get seller',
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

router.put('/:sellerId', upload.single('cover'), async (req, res) => {
  try {
    const { sellerId } = req.params
    const token = req.headers.authorization
    await AuthorizationServices(token)
    if (req.file) req.body.cover = req.file

    await handler.putSellerByIdHandler(sellerId, req.body)
    res.status(200).json(
      { 
        status: 'success',
        message: 'Success update seller'
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})

// route seller flower
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
        message: 'Success get flower',
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

router.get('/transaction/list', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: ownerId } = decodedToken
    const transactionData = await handler.getSellerTransactionHandler(ownerId)
    res.status(200).json(
      { 
        status: 'success',
        message: 'Success get seller',
        data: transactionData
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
    const decodedToken = await AuthorizationServices(token)
    const { uid: ownerId } = decodedToken
    if (req.file) req.body.cover = req.file

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
    const decodedToken = await AuthorizationServices(token)
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
    const decodedToken = await AuthorizationServices(token)
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
