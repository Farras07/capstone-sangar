const NotFoundError = require('../../exceptions/NotFoundError')
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
      throw error
    }
  }

  async getCartByIdHandler(cartId) {
    try {
      return await this._service.getCart(cartId)
    } catch (error) {
      throw error
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
      throw error
    }
  }

  async deleteWishlistProductHandler(userId, productId) {
    try {
      // Implementation to delete a cart
      return await this._service.deleteWishlistProduct(userId, productId)
    } catch (error) {
      throw error
    }
  }
}

module.exports = WishlistHandler
