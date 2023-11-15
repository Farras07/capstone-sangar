const { nanoid } = require('nanoid')
const FlowerService = require('../../services/flowerServices')
class SellerHandler {
  constructor (validator) {
    // this._service = service
    this._validator = validator
    this._flowerService = new FlowerService()
  }

  async getSellerFlowersHandler (sellerId) {
    const message = sellerId
    return message
  }

  async addSellerFlowerHandler (payload, sellerId) {
    const { cover, price, stock } = payload
    await this._validator.validatePostFlowerPayload(payload)
    const priceNum = Number(price)
    const stockNum = Number(stock)
    const id = `flower-${nanoid(16)}_${sellerId}`
    payload.id = id
    payload.sellerId = sellerId
    payload.cover = cover
    payload.price = priceNum
    payload.stock = stockNum
    await this._flowerService.addFlower(payload)
    return payload.id
  }

  async updateSellerFlowerHandler (payload, sellerId, flowerid) {
    const { cover, price, stock } = payload
    await this._validator.validatePutFlowerPayload(payload)
    const priceNum = Number(price)
    const stockNum = Number(stock)
    payload.sellerId = sellerId
    payload.cover = cover
    payload.price = priceNum
    payload.stock = stockNum
    await this._flowerService.updateFlower(payload, flowerid)
  }
}
module.exports = SellerHandler
