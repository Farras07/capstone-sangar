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
      
      console.log(wishlistData)
      return wishlistData
    } catch (error) {
      console.error('Error getting wishlists:', error)
      throw error
    }
  }

  async addWishlist (data) {
    try {
      const doc = db.collection('wishlist').doc(data.id)
      await doc.set(data)
    } catch (error) {
      console.error(error)
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

      console.log(payload)
      await docRef.update({
        products: productsData
      })
      return payload.id
    } catch (error) {
      console.error(error)
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
      console.log(productsData)
      const existingProductIndex = productsData.findIndex((product) => product.id === productId)

      console.log(existingProductIndex)

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
      console.error('Error deleting product from wishlist:', error)
      throw error
    }
  }
}
//   async updateProductInCart(userId, payload, productId) {
//     try {
//       const querySnapshot = await db.collection('carts').where('userId', '==', userId).get()

//       if (querySnapshot.empty) {
//         throw new NotFoundError('Cart not found')
//       }

//       let productsData = null
//       querySnapshot.forEach((data) => { 
//         const { products } = data.data()
//         productsData = products
//       })

//       const existingProductIndex = productsData.findIndex((product) => product.productId === productId)

//       console.log(existingProductIndex)

//       if (existingProductIndex !== -1) {
//         productsData[existingProductIndex].quantity = (payload.quantity !== undefined ? payload.quantity : productsData[existingProductIndex].quantity) 
//         productsData[existingProductIndex].varian = (payload.varian !== undefined ? payload.varian : productsData[existingProductIndex].varian)
//         productsData[existingProductIndex].subtotal = productsData[existingProductIndex].quantity * productsData[existingProductIndex].price
//       } else {
//         throw new NotFoundError('Product not found In Cart')
//       }

//       if (productsData[existingProductIndex].quantity === 0) {
//         productsData.splice(existingProductIndex, 1) 
//       }

//       const total = productsData.reduce((acc, curr) => {
//         return acc + curr.subtotal
//       }, 0)

//       const docRef = querySnapshot.docs[0].ref

//       await docRef.update({
//         total,
//         products: productsData
//       }) 
//       return { message: 'Cart quantity updated successfully' }
//     } catch (error) {
//       console.error('Error updating cart quantity:', error)
//       throw error
//     }
//   }
// }

module.exports = WishlistServices
