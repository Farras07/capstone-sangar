const db = require('../db')
const gc = require('../storage')
const bucket = gc.bucket('flowers-capstone') // should be your bucket name
const ClientError = require('../exceptions/ClientError')

class FlowerServices {
  constructor () {
    this._db = db
  }

  async getFlowers () {
    const message = '<h1>Halo</h1>'
    return message
  }

  async getFlowersById (idFlower) {
    const id = idFlower
  }

  async addFlower (data) {
    try {
      const { id, flowerName, sellerId, cover: { originalname, buffer } } = data
      const filename = `${id}_${originalname}`
      const isFlowerExist = await this.verifyFlowersExist(flowerName, sellerId)

      if (isFlowerExist) {
        throw new ClientError('Flower already exist')
      }

      const file = await this.uploadFlowerImage(filename, buffer)
      console.log(file)
      if (file) {
        const imageUrl = `https://storage.googleapis.com/flowers-capstone/${sellerId}/${file}`
        data.cover = imageUrl
        const doc = db.collection('products').doc(sellerId).collection('flowers').doc(flowerName)
        await doc.set(data)
        return file
      } else {
        console.error('Failed to upload flower image')
        return null
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async updateFlower (data, flowerId) {
    try{
      const { cover: { originalname, buffer } } = data

    } catch (error) {
      console.log(error)
    }
  }

  async uploadFlowerImage (filename, buffer) {
    try {
      const file = bucket.file(filename)
      await file.save(buffer)
      return file.name
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async verifyFlowersExist(flowerName, sellerId) {
    const flowerData = await db.collection('products').doc(sellerId).collection('flowers').where('flowerName', '==', flowerName).get()
    if (!flowerData.empty) {
      console.log('No matching documents.')
      return true
    } else {
      return false
    }
  }
}
module.exports = FlowerServices
