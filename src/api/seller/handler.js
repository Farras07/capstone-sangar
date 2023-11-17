const { nanoid } = require('nanoid')
const FlowerService = require('../../services/flowerServices')
class SellerHandler {
  constructor (validator) {
    // this._service = service
    this._validator = validator
    this._flowerService = new FlowerService()
  }

  async getSellerFlowersHandler (sellerId) {
    const flowersData = await this._flowerService.getSellerFlowers(sellerId)
    return flowersData
  }
  
  async getSellerFlowerByIdHandler (flowerId, sellerId) {
    const flowersData = await this._flowerService.getSellerFlowerById(flowerId, sellerId)
    return flowersData
  }

  async addSellerFlowerHandler (payload, sellerId) {
    const { cover, price, stock } = payload
    await this._validator.validatePostFlowerPayload(payload)
    const priceNum = Number(price)
    const stockNum = Number(stock)
    const id = `flower-${nanoid(16)}_${sellerId}`
    payload = {
      ...payload,
      id,
      sellerId,
      price: priceNum,
      cover,
      stock: stockNum
    }
    await this._flowerService.addFlower(payload)
    return payload.id
  }

  async updateSellerFlowerHandler (payload, sellerId, flowerid) {
    const cover = payload.cover !== undefined ? payload.cover : undefined
    await this._validator.validatePutFlowerPayload(payload)
    const flowerData = await this._flowerService.getSellerFlowerById(flowerid, sellerId)
    console.log(flowerData)
    const flowerName = flowerData.flowerName

    if (payload.price !== undefined) payload.price = Number(payload.price)
    if (payload.stock !== undefined) payload.stock = Number(payload.stock)

    if (cover !== undefined) payload.cover = cover
    await this._flowerService.updateFlower(payload, flowerid, sellerId, flowerName)
  }

  async deleteSellerFlowerHandler(sellerId, flowerId) {
    const result = await this._flowerService.deleteSellerFlowerById(flowerId, sellerId)
    return result
  }
}
module.exports = SellerHandler
