const FlowerServices = require('../../services/flowerServices')
const SellerServices = require('../../services/sellerServices')
const flowerServices = new FlowerServices()
const sellerServices = new SellerServices()
class CartHandler {
  constructor(services, validator) {
    this._service = services
    this._validator = validator
    this._flowerServices = flowerServices
    this._sellerServices = sellerServices
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
      throw error
    }
  }

  async getCartByIdHandler(cartId) {
    try {
      // Implementation to retrieve and return a specific cart by ID
      return await this._service.getCart(cartId)
    } catch (error) {
      throw error
    }
  }

  async postProductToCartHandler(userId, payload, productId) {
    try {
      // Validate the payload using the validator
      this._validator.validatePostCartPayload(payload)
      const flowerData = await this._flowerServices.getFlowerById(productId)
      const { cover, price, flowerName, sellerId } = flowerData
      const sellerData = await this._sellerServices.getSellerById(sellerId)
      
      const total = price * payload.quantity
      if (cover) {
        payload.cover = cover
      }
      payload = {
        ...payload,
        productId,
        price,
        seller: sellerData,
        flowerName,
        subtotal: total
      }
      // Implementation to add a new cart
      return await this._service.addProductToCart(userId, payload)
    } catch (error) {
      throw error
    }
  }

  async updateCartHandler(userId, payload, productId) {
    try {
      // Validate the payload using the validator
      this._validator.validatePutCartPayload(payload)

      // Implementation to update an existing cart
      return await this._service.updateProductInCart(userId, payload, productId)
    } catch (error) {
      throw error
    }
  }

  async deleteProductCartHandler(userId, productId) {
    try {
      // Implementation to delete a cart
      return await this._service.deleteProductCart(userId, productId)
    } catch (error) {
      throw error
    }
  }
}

module.exports = CartHandler
