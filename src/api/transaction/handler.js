const { nanoid } = require('nanoid')
const CartServices = require('../../services/cartServices')
const cartServices = new CartServices()
class TransactionHandler {
  constructor (services, validator) {
    this._service = services
    this._cartService = cartServices
    this._validator = validator
  }
  
  async postTransactionHandler (userId) {
    // await this._validator.validatePostTransactionPayload(payload)
    const cartData = await this._cartService.getCart(userId)
    const { total, products } = cartData
    console.log(cartData)
    const id = `TRK-${nanoid(16)}`
    const dateOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta',
      hour12: false 
    }

    const currentDate = new Date().toLocaleDateString('en-US', dateOptions)
    const dataTransaction = {
      id,
      userId,
      products,
      total,
      date: currentDate,
      status: 'Waiting for Payment'
    }
    const data = await this._service.addTransaction(dataTransaction)
    return data
  }

  async getTransactionsByUserIdHandler (userId) {
    const data = await this._service.getTransactions(userId)
    return data
  }
  
  async getTransactionByIdHandler (userId, transactionId) {
    const data = await this._service.getTransactionById(userId, transactionId)
    return data
  }

  async putTransactionByIdHandler(userId, transactionId, payload) {
    await this._service.updateTransaction(userId, transactionId, payload)
  }
}
module.exports = TransactionHandler
