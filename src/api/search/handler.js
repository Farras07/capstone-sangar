class SearchHandler {
  constructor (services, validator) {
    this._service = services
    this._validator = validator
  }
  
  async getSellerFlowerByNameHandler (flowerName, sellerId) {
    const data = await this._service.getSellerFlowerByName(flowerName, sellerId)
    return data
  }

  async getFlowerByNameHandler(flowerName) {
    const data = await this._service.getFlowersByName(flowerName)
    return data
  }
}
module.exports = SearchHandler
