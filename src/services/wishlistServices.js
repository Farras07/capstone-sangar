const db = require('../config/dbConfig')
const NotFoundError = require('../exceptions/NotFoundError')

class WishlistServices {
  constructor() {
    this._db = db
  }

  async getWishlists(userId) {
    try {
      // Implementation to retrieve carts
      const querySnapshot = await db.collection('wishlist').where('userId', '==', userId).get()

      let wishlistData = null
      querySnapshot.forEach((doc) => {
        const cartData = doc.data()
        wishlistData = cartData
      })

      if (wishlistData.length === 0) {
        throw new NotFoundError('Wislist not found')
      }
      
      return wishlistData
    } catch (error) {
      throw error
    }
  }

  async addWishlist (data) {
    try {
      const doc = db.collection('wishlist').doc(data.id)
      await doc.set(data)
    } catch (error) {
      throw error
    }
  }

  async addProductToCart(userId, payload) {
    try {
      const querySnapshot = await db.collection('wishlist').where('userId', '==', userId).get()

      if (querySnapshot.empty) {
        throw new NotFoundError('wishlist not found')
      }

      let productsData = null
      querySnapshot.forEach((data) => { 
        const { products } = data.data()
        productsData = products
      })

      productsData.push(payload)
      const docRef = querySnapshot.docs[0].ref

      await docRef.update({
        products: productsData
      })
      return payload.id
    } catch (error) {
      throw error
    }
  }
 
  async deleteWishlistProduct(userId, productId) {
    try {
      const querySnapshot = await db.collection('wishlist').where('userId', '==', userId).get()

      if (querySnapshot.empty) {
        throw new NotFoundError('Wishlist not found')
      }

      let productsData = null
      querySnapshot.forEach((data) => { 
        const { products } = data.data()
        productsData = products
      })
      const existingProductIndex = productsData.findIndex((product) => product.id === productId)

      if (existingProductIndex !== -1) {
        productsData.splice(existingProductIndex, 1)
      } else {
        throw new NotFoundError('Product not found In Wishlist')
      }

      const docRef = querySnapshot.docs[0].ref

      await docRef.update({
        products: productsData
      }) 
      return productId
    } catch (error) {
      throw error
    }
  }
}

module.exports = WishlistServices
