class FlowerHandler {
  constructor (services, validator) {
    this._service = services
    this._validator = validator
  }

  async getFlowersHandler (payload) {
    const message = '<h1>Halo</h1>'
    return message
  }

  async getFlowerByIdHandler (idFlower) {
    const message = idFlower
    return message
  }
}
module.exports = FlowerHandler
