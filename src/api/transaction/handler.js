const { nanoid } = require('nanoid')
class TransactionHandler {
  constructor (services, validator) {
    this._service = services
    this._validator = validator
  }
  
  async postTransactionHandler (userId, payload) {
    await this._validator.validatePostTransactionPayload(payload)
    const id = `TRK-${nanoid(16)}`
    const total = payload.products.reduce((acc, curr) => {
      return acc + (curr.price * curr.quantity)
    }, 0)
    console.log(`hasil = ${total}`)

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
    payload = {
      ...payload,
      id,
      userId,
      total,
      date: currentDate,
      status: 'Waiting for Payment'
    }
    const data = await this._service.addTransaction(payload)
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
