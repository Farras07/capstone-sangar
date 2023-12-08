const FlowerServices = require('../../services/flowerServices')
const flowerServices = new FlowerServices()
class WishlistHandler {
  constructor(services, validator) {
    this._service = services
    this._validator = validator
    this._flowerServices = flowerServices
  }

  async getWishlistHandler(userId) {
    try {
      return await this._service.getWishlists(userId)
    } catch (error) {
      throw new Error(`Failed to get carts: ${error.message}`)
    }
  }

  async getCartByIdHandler(cartId) {
    try {
      return await this._service.getCart(cartId)
    } catch (error) {
      throw new Error(`Failed to get cart by ID: ${error.message}`)
    }
  }

  async postProductToWishlistHandler(userId, payload) {
    try {
      // Validate the payload using the validator
      this._validator.validatePostWishlistPayload(payload)
      const { productId } = payload
      const flowerData = await this._flowerServices.getFlowerById(productId)
      const { caseSearch, ...wishlistData } = flowerData

      return await this._service.addProductToCart(userId, wishlistData)
    } catch (error) {
      throw new Error(`Failed to add cart: ${error.message}`)
    }
  }

  async deleteWishlistProductHandler(userId, productId) {
    try {
      // Implementation to delete a cart
      return await this._service.deleteWishlistProduct(userId, productId)
    } catch (error) {
      throw new Error(`Failed to delete cart: ${error.message}`)
    }
  }
}

module.exports = WishlistHandler
