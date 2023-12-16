/* eslint-disable no-useless-return */
/* eslint-disable array-callback-return */
const db = require('../config/dbConfig')
const NotFoundError = require('../exceptions/NotFoundError')
// const ClientError = require('../exceptions/ClientError')
// const gc = require('../storage')
// const bucket = gc.bucket('flowers-capstone') // should be your bucket name

class CatalogServices {
  constructor() {
    this._db = db
  }
  
  async getCatalog() {
    try {
      const querySnapshot = await this._db.collection('katalog').get()
      const catalogFlower = []
      querySnapshot.forEach((doc) => {
        const cartData = doc.data()
        catalogFlower.push(cartData)
      })

      if (catalogFlower.length === 0) {
        throw new NotFoundError('Catalog Flower not found')
      }
      
      return catalogFlower
    } catch (error) {
      throw error
    }
  }

  async getCatalogById(id) {
    try {
      const querySnapshot = await this._db.collection('katalog').where('id', '==', id).get()

      let catalogFlower = null
      querySnapshot.forEach((doc) => {
        const cartData = doc.data()
        catalogFlower = cartData
      })

      if (!catalogFlower) {
        throw new NotFoundError('Flower not found in catalog')
      }
      
      return catalogFlower
    } catch (error) {
      throw error
    }
  }

  async getCatalogByName(flowerName) {
    try {
      const querySnapshot = await this._db.collection('katalog').where('flowerName', '>=', flowerName).where('flowerName', '<=', flowerName + '\uf8ff').get()
      const catalogFlower = []
      querySnapshot.forEach((doc) => {
        const cartData = doc.data()
        catalogFlower.push(cartData)
      })
      if (catalogFlower.length === 0) {
        const flowerData = await this.getCatalogByLocalName(flowerName)
        return flowerData
      }
      
      return catalogFlower
    } catch (error) {
      throw error
    }
  }

  async getCatalogByLocalName(flowerName) {
    try {
    //   const querySnapshot = await this._db.collection('katalog').orderBy('localName').startAt(flowerName).endAt(flowerName).get()
      const querySnapshot = await this._db.collection('katalog').where('localName', '>=', flowerName).where('localName', '<=', flowerName + '\uf8ff').get()
      const catalogFlower = []
      querySnapshot.forEach((doc) => {
        const cartData = doc.data()
        catalogFlower.push(cartData) 
      })
  
      if (catalogFlower.length === 0) {
        throw new NotFoundError('Flower not found in catalog')
      }
        
      return catalogFlower
    } catch (error) {
      throw error
    }
  }
}
module.exports = CatalogServices
