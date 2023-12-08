const express = require('express')
const router = express.Router()
const WishlistHandler = require('./handler')
const validator = require('../../validator/wishlist')
const WishlistServices = require('../../services/wishlistServices')
const AuthorizationServices = require('../../services/authorizationServices')
const wishlistServices = new WishlistServices()
const handler = new WishlistHandler(wishlistServices, validator)

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: userId } = decodedToken

    const carts = await handler.getWishlistHandler(userId)
    res.status(200).json({
      status: 'success',
      message: 'Success get wishlist',
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
    const wishlistProductId = await handler.postProductToWishlistHandler(userId, req.body)
    res.status(200).json({
      status: 'success',
      message: 'Successfully add product to wishlist',
      data: {
        ProductId: wishlistProductId
      }
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

    const deletedWishlist = await handler.deleteWishlistProductHandler(userId, productId)

    if (!deletedWishlist) {
      return res.status(404).json({ error: 'Cart item not found' })
    }

    res.status(200).json({ 
      status: 'success',
      message: 'success deleted wishlist product',
      data: {
        id: deletedWishlist
      }  
    })
  } catch (error) {
    res.status(error.statusCode || 500).json({ 
      status: 'fail',
      message: error.message
    })
  }
})

module.exports = router
