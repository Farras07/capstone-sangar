class FlowerHandler {
  constructor (services, validator) {
    this._service = services
    this._validator = validator
  }

  async getFlowersHandler () {
    const data = await this._service.getFlowers()
    return data
  }

  async getFlowerByIdHandler (idFlower) {
    const data = await this._service.getFlowerById(idFlower)
    return data
  }
}
module.exports = FlowerHandler
