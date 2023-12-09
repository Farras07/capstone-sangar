class CatalogHandler {
  constructor (services) {
    this._service = services
  }
  
  async getCatalogHandler () {
    const data = await this._service.getCatalog()
    return data
  }

  async getCatalogFlowerByIdHandler (idCatalogFlower) {
    const data = await this._service.getCatalogById(idCatalogFlower)
    return data
  }

  async getCatalogFlowerByNameHandler (nameCatalogFlower) {
    const data = await this._service.getCatalogByName(nameCatalogFlower)
    return data
  }
}
module.exports = CatalogHandler
