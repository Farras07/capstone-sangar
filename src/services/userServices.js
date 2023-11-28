const db = require('../config/dbConfig')
const gc = require('../config/storageConfig')
const bucket = gc.bucket('user-flowercapstone') // should be your bucket name
const NotFoundError = require('../exceptions/NotFoundError')
const ClientError = require('../exceptions/ClientError')
class UserServices {
  constructor () {
    this._db = db
  }

  async getUserById(id) {
    try {
      const querySnapshot = await db.collection('users').where('id', '==', id).get()
  
      let userData = null
      querySnapshot.forEach((doc) => {
        userData = doc.data()
      })
      if (!userData) {
        throw new NotFoundError('User not found')
      }
      console.log(userData)
  
      return userData
    } catch (error) {
      console.error('Error getting flowers:', error)
      throw error
    }
  }

  async addUser (data) {
    try {
      const doc = db.collection('users').doc(data.email)
      await doc.set(data)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async uploadUserImage(filename, buffer) {
    try {
      const file = bucket.file(filename)
      await file.save(buffer)
      return file.name
    } catch (error) {
      return error
    }
  }
}
module.exports = UserServices
