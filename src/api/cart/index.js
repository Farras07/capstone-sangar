const express = require('express')
const router = express.Router()
const CartHandler = require('./handler')
const validator = require('../../validator/cart')
const CartServices = require('../../services/cartServices')
const AuthorizationServices = require('../../services/authorizationServices')
const cartServices = new CartServices()
const handler = new CartHandler(cartServices, validator)

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: userId } = decodedToken

    const carts = await handler.getCartHandler(userId)
    res.status(200).json({
      status: 'success',
      message: 'Success get cart',
      data: {
        carts
      }
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})

router.post('/product', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: userId } = decodedToken
    const { productId } = req.body
    await handler.postProductToCartHandler(userId, req.body, productId)

    res.status(200).json({
      status: 'success',
      message: 'success add product to cart'
    })  
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})

router.put('/product/:productId', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: userId } = decodedToken
    const productId = req.params.productId
    await handler.updateCartHandler(userId, req.body, productId)

    res.status(200).json({
      status: 'success',
      message: 'success update product in cart'
    })  
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })  
  }
})

router.delete('/product/:productId', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: userId } = decodedToken
    const { productId } = req.params

    const deletedCart = await handler.deleteProductCartHandler(userId, productId)

    if (!deletedCart) {
      return res.status(404).json({ error: 'Cart item not found' })
    }

    res.status(200).json({ 
      status: 'success',
      message: 'success deleted cart product',
      data: {
        id: deletedCart
      }
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message })
  }
})

module.exports = router
