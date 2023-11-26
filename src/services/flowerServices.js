const db = require('../db')
const gc = require('../storage')
const bucket = gc.bucket('flowers-capstone') // should be your bucket name
const NotFoundError = require('../exceptions/NotFoundError')
const ClientError = require('../exceptions/ClientError')
class FlowerServices {
  constructor () {
    this._db = db
  }

  async getFlowers () {
    try {
      const querySnapshot = await db.collectionGroup('flowers').get()
  
      const flowersData = []
      querySnapshot.forEach((doc) => {
        const flowerData = doc.data()
        flowersData.push(flowerData)
      })
      console.log(flowersData)
  
      return flowersData
    } catch (error) {
      console.error('Error getting flowers:', error)
      throw error
    }
  }

  async getFlowerById(idFlower) {
    try {
      const querySnapshot = await db.collectionGroup('flowers').where('id', '==', idFlower).get()
  
      let flowerData = null
      querySnapshot.forEach((doc) => {
        flowerData = doc.data()
      })
      if (!flowerData) {
        throw new NotFoundError('Flower not found')
      }
      console.log(flowerData)
  
      return flowerData
    } catch (error) {
      console.error('Error getting flowers:', error)
      throw error
    }
  }

  async getSellerFlowers (sellerId) {
    const flowersData = []
    const datas = await db.collection('products').doc(sellerId).collection('flowers').get()
    datas.forEach((data) => {
      const flowerData = data.data()
      flowersData.push(flowerData)
    })
  
    if (flowersData.length === 0) {
      throw new NotFoundError('Flowers not found')
    }
  
    return flowersData
  }
  
  async getSellerFlowerById (flowerId, sellerId) {
    try {
      let flowerData = null
      const datas = await db.collection('products').doc(sellerId).collection('flowers').where('id', '==', flowerId).get()
      datas.forEach((data) => { 
        flowerData = data.data()
      })
      
      if (flowerData === null) {
        throw new NotFoundError('Flowers not found')
      }
  
      return flowerData
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async addFlower (data) {
    try {
      const { id, flowerName, sellerId, cover: { originalname, buffer } } = data
      const filename = `${id}_${originalname}`
      const isFlowerExist = await this.verifyFlowersExistByName(flowerName, sellerId)

      if (isFlowerExist) {
        throw new ClientError('Flower already exist')
      }

      const file = await this.uploadFlowerImage(filename, buffer)
      console.log(file)
      if (file) {
        const imageUrl = `${process.env.GS_URL}/${file}`
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

  async updateFlower (data, flowerId, sellerId, flowerName) {
    try {
      if (data.cover !== undefined) {
        const query = db.collection('products').doc(sellerId).collection('flowers').where('id', '==', flowerId)
        const snapshot = await query.get()
        await this.deleteFlowerImage(snapshot)

        const { cover: { originalname, buffer } } = data
        const filename = `${flowerId}_${originalname}`
        const file = await this.uploadFlowerImage(filename, buffer)
        const imageUrl = `${process.env.GS_URL}/${file}`
        data.cover = imageUrl
      }
      console.log('ddd')
      console.log(data)
      const doc = db.collection('products').doc(sellerId).collection('flowers').doc(flowerName)
      await doc.update(data)
    } catch (error) {
      return error
    }
  }

  async deleteSellerFlowerById (flowerId, sellerId) {
    try {
      const isFlowerExist = await this.verifyFlowerExistById(flowerId, sellerId)
      if (!isFlowerExist) {
        throw new NotFoundError('Flower not found')
      }
      const query = db.collection('products').doc(sellerId).collection('flowers').where('id', '==', flowerId)
      // Get the documents that match the query
      const snapshot = await query.get()
      
      await this.deleteFlowerImage(snapshot)
      
      // Check if there are matching documents
      if (!snapshot.empty) {
        // Delete each matching document
        snapshot.forEach((doc) => {
          doc.ref.delete()
        })
      }
    } catch (error) {
      console.log('INTERNAL SERVER ERROR')
      throw error
    }
  }

  async uploadFlowerImage (filename, buffer) {
    try {
      const file = bucket.file(filename)
      await file.save(buffer)
      return file.name
    } catch (error) {
      return error
    }
  }

  async deleteFlowerImage (data) {
    try {
      const filename = await Promise.all(data.docs.map(async (doc) => {
        const flowerData = doc.data()
        const coverFile = flowerData.cover.split('/').pop()
        console.log(coverFile)
        return coverFile
      }))
      const file = bucket.file(filename)
  
      // Check if the file exists
      const exists = await file.exists()
  
      if (exists[0]) {
        // File exists, so delete it
        await file.delete()
        console.log(`File ${filename} deleted successfully`)
      } else {
        throw new NotFoundError('Image File Not Found')
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async createGSDirectory(directoryPath) {
    try {
      await bucket.file(directoryPath).create({ ifNotExist: true })
      console.log(`Directory '${directoryPath}' created.`)
    } catch (error) {
      console.error('Error creating directory:', error)
    }
  }

  async verifyFlowersExistByName(flowerName, sellerId) {
    const flowerData = await db.collection('products').doc(sellerId).collection('flowers').where('flowerName', '==', flowerName).get()
    if (!flowerData.empty) {
      console.log('No matching documents.')
      return true
    } else {
      return false
    }
  }

  async verifyFlowerExistById(flowerId, sellerId) {
    const flowerData = await db.collection('products').doc(sellerId).collection('flowers').where('id', '==', flowerId).get()
    if (!flowerData.empty) {
      return true
    } else {
      console.log('No matching documents.')
      return false
    }
  }
}
module.exports = FlowerServices
