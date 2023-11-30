const db = require('../config/dbConfig')
const NotFoundError = require('../exceptions/NotFoundError')
// const ClientError = require('../exceptions/ClientError')
// const gc = require('../storage')
// const bucket = gc.bucket('flowers-capstone') // should be your bucket name

class CartServices {
  constructor() {
    this._db = db
  }

  async getCart(userId) {
    try {
      // Implementation to retrieve carts
      const querySnapshot = await db.collection('carts').where('userId', '==', userId).get()

      const cartsData = []
      querySnapshot.forEach((doc) => {
        const cartData = doc.data()
        cartsData.push(cartData)
      })

      if (cartsData.length === 0) {
        throw new NotFoundError('Cart not found')
      }
      
      console.log(cartsData)
      return cartsData
    } catch (error) {
      console.error('Error getting carts:', error)
      throw error
    }
  }
  
  // async addCart(data) {
  //   try {
  //     // Implementation to add a new cart
  //     // Make sure to adjust this method based on your data structure and requirements
  //     const docRef = await this._db.collection('carts').add(data)
    
  //     console.log('Cart added successfully with ID:', docRef.id)
  
  //     // Update the added cart with the generated ID
  //     await docRef.update({ id: docRef.id })
  
  //     return { id: docRef.id, ...data }
  //   } catch (error) {
  //     console.error('Error adding cart:', error)
  //     throw error
  //   }
  // }

  async addCart (data) {
    try {
      const doc = db.collection('carts').doc(data.id)
      await doc.set(data)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async updateProductInCartQuantity(cartId, quantity) {
    try {
      const docRef = this._db.collection('carts').doc(cartId)

      const doc = await docRef.get()

      if (!doc.exists) {
        throw new NotFoundError('Cart not found')
      }

      await docRef.update({ quantity })

      console.log('Cart quantity updated successfully')

      return { message: 'Cart quantity updated successfully' }
    } catch (error) {
      console.error('Error updating cart quantity:', error)
      throw error
    }
  }

  // async deleteCart(cartId) {
  //   try {
  //     // Implementation to delete a cart
  //     // Make sure to adjust this method based on your data structure and requirements
  //     const docRef = this._db.collection('carts').doc(cartId)
  //     const doc = await docRef.get()

  //     if (!doc.exists) {
  //       throw new NotFoundError('Cart not found')
  //     }

  //     await docRef.delete()

  //     console.log('Cart deleted successfully')

  //     return { message: 'Cart deleted successfully' }
  //   } catch (error) {
  //     console.error('Error deleting cart:', error)
  //     throw error
  //   }
  // }
}

module.exports = CartServices
