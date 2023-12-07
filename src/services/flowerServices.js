const db = require('../config/dbConfig')
const gc = require('../config/storageConfig')
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
  
      return flowerData
    } catch (error) {
      console.error('Error getting flower:', error)
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
        throw new NotFoundError('Flower not found')
      }
  
      return flowerData
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async getSellerFlowerByName(flowerName, sellerId) {
    try {
      const querySnapshot = await db.collection('products').doc(sellerId).collection('flowers').where('caseSearch', 'array-contains', flowerName.toLowerCase()).get()
      const flowersData = []
      querySnapshot.forEach((data) => {
        const flowerData = data.data()
        const { caseSearch, ...flowerWithoutCaseSearch } = flowerData
        flowersData.push(flowerWithoutCaseSearch)
      })
      if (flowersData.length === 0) {
        throw new NotFoundError('Flower not found')
      }
      return flowersData
    } catch (error) {
      console.error('Error getting flowers:', error)
      throw error
    }
  }

  async getFlowersByName(flowerName) {
    try {
      // const docSnap = await db.collection('products').doc('sellerId').collection('flowers').where('flowerName', '==', flowerName).get()
      const querySnapshot = await db.collection('products').get()
      const promises = []
      querySnapshot.forEach((doc) => {
        const sellerId = doc.id
        console.log(sellerId)
        if (sellerId) {
          // const flowerQuery = db.collection('products').doc(sellerId).collection('flowers').where('flowerName', '>=', flowerName.toUpperCase()).where('flowerName', '<=', flowerName + '\uf8ff').orderBy('flowerName').limit(10).get()
          const flowerQuery = db.collection('products').doc(sellerId).collection('flowers').where('caseSearch', 'array-contains', flowerName.toLowerCase()).get()
          promises.push(flowerQuery)
        }
      })

      const snapshotArrays = await Promise.all(promises)
      const flowerData = []
      snapshotArrays.forEach(snapArray => {
        snapArray.forEach((snap) => {
          const flower = snap.data()
          const { caseSearch, ...flowerWithoutCaseSearch } = flower
          flowerData.push(flowerWithoutCaseSearch)
        })
        if (flowerData.length === 0) {
          throw new NotFoundError('Flower not found')
        }
      })
      return flowerData 
    } catch (error) {
      console.error('Error getting flowers:', error)
      throw error
    }
  }

  async addFlower (data) {
    try {
      const { cover, ...newData } = data
      console.log(data)
      const { id, flowerName, sellerId } = data
      const searchParams = await this.setSeacrhParams(flowerName)
      const isFlowerExist = await this.verifyFlowersExistByName(flowerName, sellerId)
      if (isFlowerExist) {
        throw new ClientError('Flower already exist')
      }

      if (cover !== undefined) {
        const filename = `${id}_${data.cover.originalname}`
        const file = await this.uploadFlowerImage(filename, data.cover.buffer)

        console.log('file')
        console.log(file)
        if (file) {
          const imageUrl = `${process.env.GS_URL}/${file}`
          newData.cover = imageUrl
        } else {
          console.error('Failed to upload flower image')
          return null
        }
      }
      console.log('haloo')
      const doc = db.collection('products').doc(sellerId).collection('flowers').doc(flowerName)
      // await doc.set(newData)
      await doc.set({ ...newData, caseSearch: searchParams })
      // await doc.set(data)
      return id
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
        console.log('before')
        await this.deleteFlowerImage(snapshot)

        const { cover: { originalname, buffer } } = data
        const filename = `${flowerId}_${originalname}`
        const file = await this.uploadFlowerImage(filename, buffer)
        const imageUrl = `${process.env.GS_URL}/${file}`
        data.cover = imageUrl
      }
      console.log('ddd')
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
      
      // Check if there are matching documents
      if (!snapshot.empty) {
        // Delete each matching document
        await snapshot.forEach((doc) => {
          if (doc.cover !== undefined) this.deleteFlowerImage(snapshot)
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
        console.log('haloo')
        const coverFile = flowerData.cover ? flowerData.cover.split('/').pop() : undefined
        console.log(coverFile)
        return coverFile
      }))

      console.log('filename')
      if (filename[0] !== undefined) {
        console.log('hehehe')
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

  async setSeacrhParams(flowerName) {
    const caseSearchList = []
    let temp = ''
    for (let i = 0; i < flowerName.length; i++) {
      temp = temp + flowerName[i]
      caseSearchList.push(temp.toLowerCase())
    }
    return caseSearchList
  }
}
module.exports = FlowerServices
