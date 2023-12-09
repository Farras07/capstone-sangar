const FlowerServices = require('../../services/flowerServices')
const flowerServices = new FlowerServices()
class CartHandler {
  constructor(services, validator) {
    this._service = services
    this._validator = validator
    this._flowerServices = flowerServices
  }

  // async getCartsHandler() {
  //   try {
  //     // Implementation to retrieve and return carts
  //     return await this._service.getCarts()
  //   } catch (error) {
  //     throw new Error(`Failed to get carts: ${error.message}`)
  //   }
  // }

  async getCartHandler(userId) {
    try {
      return await this._service.getCart(userId)
    } catch (error) {
      throw new Error(`Failed to get carts: ${error.message}`)
    }
  }

  async getCartByIdHandler(cartId) {
    try {
      // Implementation to retrieve and return a specific cart by ID
      return await this._service.getCart(cartId)
    } catch (error) {
      throw new Error(`Failed to get cart by ID: ${error.message}`)
    }
  }

  async postProductToCartHandler(userId, payload, productId) {
    try {
      // Validate the payload using the validator
      this._validator.validatePostCartPayload(payload)
      console.log('lahh')
      const flowerData = await this._flowerServices.getFlowerById(productId)
      const { cover, price, flowerName, sellerId } = flowerData

      const total = price * payload.quantity
      console.log('jajaj')
      if (cover) {
        payload.cover = cover
      }
      payload = {
        ...payload,
        productId,
        price,
        sellerId,
        flowerName,
        subtotal: total
      }
      console.log(payload)
      // Implementation to add a new cart
      return await this._service.addProductToCart(userId, payload)
    } catch (error) {
      throw new Error(`Failed to add cart: ${error.message}`)
    }
  }

  async updateCartHandler(userId, payload, productId) {
    try {
      // Validate the payload using the validator
      this._validator.validatePutCartPayload(payload)

      // Implementation to update an existing cart
      return await this._service.updateProductInCart(userId, payload, productId)
    } catch (error) {
      throw new Error(`Failed to update cart: ${error.message}`)
    }
  }

  async deleteProductCartHandler(userId, productId) {
    try {
      // Implementation to delete a cart
      return await this._service.deleteProductCart(userId, productId)
    } catch (error) {
      throw new Error(`Failed to delete cart: ${error.message}`)
    }
  }
}

module.exports = CartHandler
