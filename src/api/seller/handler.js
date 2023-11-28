const { nanoid } = require('nanoid')
const FlowerService = require('../../services/flowerServices')
const flowerValidator = require('../../validator/flowers')
class SellerHandler {
  constructor (validator, services) {
    // this._service = service
    this._validator = validator
    this._flowerValidator = flowerValidator
    this._sellerServices = services
    this._flowerService = new FlowerService()
  }

  async postSellerHandler (credentialId, payload) {
    const image = payload.cover
    await this._validator.validatePostSellerPayload(payload)
    const sellerId = `seller-${nanoid(16)}`
    payload = {
      ...payload,
      sellerId,
      ownerId: credentialId,
      cover: image
    }
    const id = await this._sellerServices.addSeller(payload)
    return id
  }

  async getSellerByIdHandler (sellerId) {
    const sellerData = await this._sellerServices.getSellerById(sellerId)
    return sellerData
  }

  async getSellerByOwnerIdHandler (ownerId) {
    const sellerData = await this._sellerServices.getSellerByOwnerId(ownerId)
    return sellerData
  }

  async getSellerFlowersHandler (sellerId) {
    const flowersData = await this._flowerService.getSellerFlowers(sellerId)
    return flowersData
  }
  
  async getSellerFlowerByIdHandler (flowerId, sellerId) {
    const flowersData = await this._flowerService.getSellerFlowerById(flowerId, sellerId)
    return flowersData
  }

  async addSellerFlowerHandler (payload, ownerId) {
    const { cover, price, stock } = payload
    await this._flowerValidator.validatePostFlowerPayload(payload)
    const sellerData = await this._sellerServices.getSellerByOwnerId(ownerId)
    const { sellerId } = sellerData
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

  async updateSellerFlowerHandler (payload, ownerId, flowerid) {
    const cover = payload.cover !== undefined ? payload.cover : undefined
    await this._flowerValidator.validatePutFlowerPayload(payload)

    const sellerData = await this._sellerServices.getSellerByOwnerId(ownerId)
    const { sellerId } = sellerData

    const flowerData = await this._flowerService.getSellerFlowerById(flowerid, sellerId)
    console.log(flowerData)
    const flowerName = flowerData.flowerName

    if (payload.price !== undefined) payload.price = Number(payload.price)
    if (payload.stock !== undefined) payload.stock = Number(payload.stock)

    if (cover !== undefined) payload.cover = cover
    await this._flowerService.updateFlower(payload, flowerid, sellerId, flowerName)
  }

  async deleteSellerFlowerHandler(ownerId, flowerId) {
    const sellerData = await this._sellerServices.getSellerByOwnerId(ownerId)
    const { sellerId } = sellerData
    
    const result = await this._flowerService.deleteSellerFlowerById(flowerId, sellerId)
    return result
  }
}
module.exports = SellerHandler
