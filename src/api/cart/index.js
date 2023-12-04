const express = require('express')
const router = express.Router()
const CartHandler = require('./handler')
const validator = require('../../validator/cart')
const CartServices = require('../../services/cartServices')
const AuthorizationServices = require('../../services/authorizationServices')
const cartServices = new CartServices()
const handler = new CartHandler(cartServices, validator)

// router.get('/', async (req, res) => {
//   try {
//     const carts = await handler.getCartsHandler()
//     res.status(200).json(carts)
//   } catch (error) {
//     res.status(500).json({
//       status: 'Fail',
//       message: error.message
//     })
//   }
// })

router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization
    const decodedToken = await AuthorizationServices(token)
    const { uid: userId } = decodedToken

    const carts = await handler.getCartHandler(userId)
    res.status(200).json(carts)
  } catch (error) {
    res.status(500).json({
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
    console.log('halooo')
    await handler.postProductToCartHandler(userId, req.body, productId)

    res.status(200).json({
      status: 'success',
      message: 'success add product to cart'
    })  
  } catch (error) {
    res.status(500 || error.statusCode).json({
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
    console.log(productId)
    await handler.updateCartHandler(userId, req.body, productId)

    res.status(200).json({
      status: 'success',
      message: 'success update product in cart'
    })  
  } catch (error) {
    res.status(500 || error.statusCode).json({
      status: 'Fail',
      message: error.message
    })  
  }
})
// router.get('/:id', async (req, res) => {
//   try {
//     const carts = await handler.getCartByIdHandler()
//     res.status(200).json(carts)
//   } catch (error) {
//     res.status(500).json({
//       status: 'Fail',
//       message: error.message
//     })
//   }
// })

// router.post('/', async (req, res) => {
//   try {
//     const newCart = await handler.addCartHandler(req.body)
//     res.status(201).json(newCart)
//   } catch (error) {
//     res.status(500).json({
//       status: 'Fail',
//       message: error.message
//     })
//   }
// })

// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params

//     const deletedCart = await handler.deleteCartHandler(id)

//     if (!deletedCart) {
//       return res.status(404).json({ error: 'Cart item not found' })
//     }

//     res.json({ message: 'Cart item deleted successfully' })
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })

module.exports = router
