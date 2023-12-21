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
    const image = payload.cover !== undefined ? payload.cover : undefined
    await this._validator.validatePostSellerPayload(payload)
    await this._sellerServices.verifyUserIsSeller(credentialId)
    const sellerId = `seller-${nanoid(16)}`

    if (image !== undefined) payload.cover = image

    if (payload.locationLatitude !== undefined && payload.locationLongitude !== undefined) {
      payload.locationLatitude = Number(payload.locationLatitude)
      payload.locationLongitude = Number(payload.locationLongitude)
    }

    let { locationLatitude: latitude, locationLongitude: longitude, ...newObject } = payload

    if (latitude !== undefined && longitude !== undefined) {
      latitude = Number(latitude)
      longitude = Number(longitude)
      newObject.location_coordinate = {
        latitude,
        longitude
      } 
    }
    newObject = {
      ...newObject,
      sellerId,
      ownerId: credentialId
    }
    const id = await this._sellerServices.addSeller(newObject)
    return id
  }

  async putSellerByIdHandler(sellerId, payload) {
    const image = payload.cover !== undefined ? payload.cover : undefined
    await this._validator.validatePutSellerPayload(payload)
    
    if (image !== undefined) payload.cover = image

    let { locationLatitude: latitude, locationLongitude: longitude, ...newObject } = payload

    if (latitude !== undefined && longitude !== undefined) {
      latitude = Number(latitude)
      longitude = Number(longitude)
      newObject.location_coordinate = {
        latitude,
        longitude
      } 
    } 

    await this._sellerServices.putSellerById(sellerId, newObject)
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

  async getAllSellerFlowersHandler() {
    console.log('halooo')
    const sellerData = await this._sellerServices.getAllSeller()
    return sellerData
  }
  
  async getSellerFlowerByIdHandler (flowerId, sellerId) {
    const flowersData = await this._flowerService.getSellerFlowerById(flowerId, sellerId)
    return flowersData
  }

  async getSellerTransactionHandler (ownerId) {
    const sellerData = await this._sellerServices.getSellerByOwnerId(ownerId)
    const { sellerId } = sellerData
    const transactionData = await this._sellerServices.getTransactionsSeller(sellerId)
    return transactionData
  }

  async addSellerFlowerHandler (payload, ownerId) {
    const { price, stock, cover } = payload
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
      stock: stockNum,
      cover
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
