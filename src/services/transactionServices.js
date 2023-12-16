const db = require('../config/dbConfig')
const NotFoundError = require('../exceptions/NotFoundError')
class TransactionServices {
  constructor () {
    this._db = db
  }

  async addTransaction(payload) {
    try {
      await this._db.collection('transactions').doc(payload.id).set(payload)
      return payload.id
    } catch (error) {
      throw error
    }
  }

  async getTransactions(userId) {
    try {
      const querySnapshot = await db.collection('transactions').where('userId', '==', userId).get()
      let transactionData = null
      querySnapshot.forEach((doc) => {
        transactionData = doc.data()
      })
      if (!transactionData) {
        throw new NotFoundError('Transaction not found')
      }
  
      return transactionData
    } catch (error) {
      throw error
    }
  }

  async getTransactionById(userId, transactionId) {
    try {
      const querySnapshot = await db.collection('transactions').where('userId', '==', userId).where('id', '==', transactionId).get()
  
      let transactionData = null
      querySnapshot.forEach((doc) => {
        transactionData = doc.data()
      })
      if (!transactionData) {
        throw new NotFoundError('Transaction not found')
      }
  
      return transactionData
    } catch (error) {
      throw error
    }
  }

  async updateTransaction(userId, transactionId, payload) {
    try {
      const querySnapshot = await db.collection('transactions').where('userId', '==', userId).where('id', '==', transactionId).get()
      querySnapshot.forEach((doc) => {
        doc.ref.update(payload)
      })
    } catch (error) {
      throw error
    }
  }
}
module.exports = TransactionServices
