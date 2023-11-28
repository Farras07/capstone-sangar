const db = require('../config/dbConfig')
const gc = require('../config/storageConfig')
const bucket = gc.bucket('seller-flowercapstone') // should be your bucket name
const NotFoundError = require('../exceptions/NotFoundError')
const ClientError = require('../exceptions/ClientError')

class SellerServices {
  constructor () {
    this._db = db
  }

  async addSeller (data) {
    try {
      const { name: namaToko, sellerId, cover: { originalname, buffer } } = data
      const filename = `${sellerId}_${originalname}`
      const isSellerNameExist = await this.verifySellerExistByName(namaToko)

      if (isSellerNameExist) {
        throw new ClientError('Nama toko already exists')
      }

      const file = await this.uploadUserImage(filename, buffer)
      console.log(file)
      if (file) {
        const imageUrl = `${process.env.GS_URL_SELLER}/${file}`
        data.cover = imageUrl
        const doc = db.collection('seller').doc(namaToko)
        await doc.set(data)
      } else {
        console.error('Failed to upload flower image')
      }
      return sellerId
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getSellerById (sellerId) {
    try {
      const querySnapshot = await db.collection('seller').where('sellerId', '==', sellerId).get()
    
      let sellerData = null
      querySnapshot.forEach((doc) => {
        sellerData = doc.data()
      })
      if (!sellerData) {
        throw new NotFoundError('Seller not found')
      }
      console.log(sellerData) 
    
      return sellerData
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async getSellerByOwnerId(ownerId) {
    try {
      console.log(ownerId)
      const querySnapshot = await db.collection('seller').where('ownerId', '==', ownerId).get()
    
      let sellerData = null
      querySnapshot.forEach((doc) => {
        sellerData = doc.data()
      })
      if (!sellerData) {
        throw new NotFoundError('Seller not found')
      }
      console.log(sellerData) 
    
      return sellerData
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async uploadUserImage (filename, buffer) {
    try {
      const file = bucket.file(filename)
      await file.save(buffer)
      return file.name
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async verifySellerExistByName(sellerName) {
    const flowerData = await db.collection('seller').where('name', '==', sellerName).get()
    if (!flowerData.empty) {
      return true
    } else {
      return false
    }
  }
}

module.exports = SellerServices
