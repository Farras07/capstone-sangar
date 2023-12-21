const db = require('../config/dbConfig')
const gc = require('../config/storageConfig')
const bucket = gc.bucket('seller-flowercapstone') // should be your bucket name
const NotFoundError = require('../exceptions/NotFoundError')
const ClientError = require('../exceptions/ClientError')
const UserServices = require('../services/userServices')
const InvariantError = require('../exceptions/InvariantError')
const userServices = new UserServices()

class SellerServices {
  constructor () {
    this._db = db
  }

  async addSeller (data) {
    try {
      const { name: namaToko, sellerId } = data
      const isSellerNameExist = await this.verifySellerExistByName(namaToko)
      if (isSellerNameExist) {
        throw new ClientError('Nama toko already exists')
      }

      if (data.cover !== undefined) {
        const filename = `${sellerId}_${data.cover.originalname}`
        const file = await this.uploadUserImage(filename, data.cover.buffer)
        if (file) {
          const imageUrl = `${process.env.GS_URL_SELLER}/${file}`
          data.cover = imageUrl
        }
      }
      const doc = db.collection('seller').doc(namaToko)
      await doc.set(data)
      return sellerId
    } catch (error) {
      throw error
    }
  }

  async putSellerById(sellerId, data) {
    try {
      const isSellerIdExist = await this.verifySellerExistById(sellerId)
      if (!isSellerIdExist) {
        throw new NotFoundError('Seller not found')
      }
   
      if (data.cover !== undefined) {
        const filename = `${sellerId}_${data.cover.originalname}`
        const file = await this.uploadUserImage(filename, data.cover.buffer)
        const imageUrl = `${process.env.GS_URL_SELLER}/${file}`
        data.cover = imageUrl
      }
   
      const querySnapshot = await db.collection('seller').where('sellerId', '==', sellerId).get()
      const docRef = querySnapshot.docs[0].ref
      await docRef.update(data)
    } catch (error) {
      throw error
    }
  }

  async getAllSeller() {
    try {
      const querySnapshot = await db.collection('seller').get()
    
      const sellerData = []
      querySnapshot.forEach((doc) => {
        sellerData.push(doc.data())
      })
      if (!sellerData) {
        throw new NotFoundError('Seller not found')
      }
    
      return sellerData
    } catch (error) {
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
    
      return sellerData
    } catch (error) {
      throw error
    }
  }

  async getSellerByOwnerId(ownerId) {
    try {
      const querySnapshot = await db.collection('seller').where('ownerId', '==', ownerId).get()
    
      let sellerData = null
      querySnapshot.forEach((doc) => {
        sellerData = doc.data()
      })
      if (!sellerData) {
        throw new NotFoundError('Seller not found')
      }
    
      return sellerData
    } catch (error) {
      throw error
    }
  }

  async getTransactionsSeller(sellerId) {
    try {
      const querySnapshot = await db.collection('transactions').get()
      const transactionData = []
      querySnapshot.forEach((doc) => {
        const transactionSeller = doc.data()
        transactionData.push(transactionSeller)
      })
      const filteredProductTransactionData = await Promise.all(transactionData.map(async (transaction) => {
        const filteredProducts = transaction.products.filter(product => product.seller.sellerId === sellerId)
  
        if (filteredProducts.length > 0) {
          const userData = await userServices.getUserById(transaction.userId)
  
          return {
            ...transaction,
            products: filteredProducts,
            buyer: {
              name: userData.name,
              contact: userData.contact,
              address: userData.address,
              location_coordinate: {
                latitude: userData.location_coordinate.latitude,
                longitude: userData.location_coordinate.longitude
              }
            }
          }
        }
  
        return null // Return null for transactions with no matching products
      }))
      
      const finalFilteredTransactionData = filteredProductTransactionData.filter(Boolean)
      const ReallyFinalFilteredTransactionData = finalFilteredTransactionData.map((transaction) => {
        const total = transaction.products.reduce((acc, curr) => {
          return acc + curr.subtotal
        }, 0)
        return { ...transaction, total }
      })
      if (ReallyFinalFilteredTransactionData.length === 0) {
        throw new NotFoundError('Transaction not found')
      }
  
      return ReallyFinalFilteredTransactionData
    } catch (error) {
      throw error
    }
  }

  async uploadUserImage (filename, buffer) {
    try {
      const file = bucket.file(filename)
      await file.save(buffer)
      return file.name
    } catch (error) {
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

  async verifySellerExistById(sellerId) {
    const sellerData = await db.collection('seller').where('sellerId', '==', sellerId).get()

    if (!sellerData.empty) {
      return true
    } else {
      return false
    }
  }

  async verifyUserIsSeller(userId) {
    const sellerData = await db.collection('seller').where('ownerId', '==', userId).get()

    if (!sellerData.empty) {
      throw new InvariantError('User is already a seller')
    } else {
      return true
    }
  }
}

module.exports = SellerServices
