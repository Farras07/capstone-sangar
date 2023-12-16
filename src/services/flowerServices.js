/* eslint-disable camelcase */
const db = require('../config/dbConfig')
const gc = require('../config/storageConfig')
const bucket = gc.bucket('flowers-capstone')
const predictBucket = gc.bucket('predict-capstone')
const NotFoundError = require('../exceptions/NotFoundError')
const ClientError = require('../exceptions/ClientError')
const SellerServices = require('../services/sellerServices')
const sellerServices = new SellerServices()
const axios = require('axios')
const FormData = require('form-data')
const { Readable } = require('stream')
const CatalogServices = require('./catalogServices.js')
const catalogServices = new CatalogServices()
class FlowerServices {
  constructor () {
    this._sellerServices = sellerServices
    this._catalogServices = catalogServices
    this._db = db
  }

  async getFlowers () {
    try {
      const querySnapshot = await db.collectionGroup('flowers').get()
  
      const flowersData = []
      querySnapshot.forEach((doc) => {
        const flowerData = doc.data()
        const { caseSearch, ...restFlowerData } = flowerData
        flowersData.push(restFlowerData)
      })
      
      if (flowersData.length === 0) {
        throw new NotFoundError('Flowers not found')
      }

      return flowersData
    } catch (error) {
      throw error
    }
  }

  async getFlowerById(idFlower) {
    try {
      const querySnapshot = await db.collectionGroup('flowers').where('id', '==', idFlower).get()
  
      let flowerDatas = null
      querySnapshot.forEach((doc) => {
        const flowerData = doc.data()
        const { caseSearch, ...restFlowerData } = flowerData
        flowerDatas = restFlowerData
      })

      if (!flowerDatas) {
        throw new NotFoundError('Flower not found')
      }
  
      return flowerDatas
    } catch (error) {
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
      
      if (!flowerData) {
        throw new NotFoundError('Flower not found')
      }
  
      return flowerData
    } catch (error) {
      throw error
    }
  }

  async getSellerFlowerByName(flowerName, sellerId) {
    try {
      const flowerQuery = await db.collection('products').doc(sellerId).collection('flowers').where('caseSearch', 'array-contains', flowerName.toLowerCase()).get()
      const flowerData = []
      flowerQuery.forEach((doc) => {
        const flower = doc.data()
        const { caseSearch, ...flowerWithoutCaseSearch } = flower
        flowerData.push(flowerWithoutCaseSearch)
      })

      if (flowerData.length === 0) {
        const flowerDataByLocalName = await this.getFlowersByLocalName(flowerName)
        return flowerDataByLocalName
      }
      
      return flowerData
    } catch (error) {
      throw error
    }
  }

  async getFlowersByName(flowerName) {
    try {
      const flowerQuery = await db.collectionGroup('flowers').where('caseSearch', 'array-contains', flowerName.toLowerCase()).get()
      const flowerData = []
  
      flowerQuery.forEach((doc) => {
        const flower = doc.data()
        const { caseSearch, ...flowerWithoutCaseSearch } = flower
        flowerData.push(flowerWithoutCaseSearch)
      })
  
      const fixedFlowersData = await Promise.all(flowerData.map(async (flower) => {
        const { sellerId, caseSearch, ...restFlowerData } = flower
        const sellerData = await this._sellerServices.getSellerById(sellerId)
        return { ...restFlowerData, seller: sellerData }
      }))
  
      if (fixedFlowersData.length === 0) {
        const formattedFlowerName = flowerName.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
        const flowerDataByLocalName = await this.getFlowersByLocalName(formattedFlowerName)
        return flowerDataByLocalName
      }
  
      return fixedFlowersData
    } catch (error) {
      throw error
    }
  }

  async getFlowersByLocalName(flowerName) {
    try {
    //   const querySnapshot = await this._db.collection('katalog').orderBy('localName').startAt(flowerName).endAt(flowerName).get()
      const querySnapshot = await this._db.collectionGroup('flowers').where('localName', '>=', flowerName).where('localName', '<=', flowerName + '\uf8ff').get()
      const flowerData = []
      querySnapshot.forEach((doc) => {
        const cartData = doc.data()
        flowerData.push(cartData) 
      })

      const fixedFlowersData = await Promise.all(flowerData.map(async (flower) => {
        const { sellerId, caseSearch, ...restFlowerData } = flower
        const sellerData = await this._sellerServices.getSellerById(sellerId)
        return { ...restFlowerData, seller: sellerData }
      }))
  
      if (fixedFlowersData.length === 0) {
        throw new NotFoundError('Flower not found')
      }
        
      return fixedFlowersData 
    } catch (error) {
      throw error
    }
  }

  async addFlower (data) {
    try {
      const { cover, ...newData } = data
      const { id, flowerName, sellerId } = data
      const searchParams = await this.setSeacrhParams(flowerName)
      const isFlowerExist = await this.verifyFlowersExistByName(flowerName, sellerId)
      if (isFlowerExist) {
        throw new ClientError('Flower already exist')
      }

      if (cover !== undefined) {
        const filename = `${id}_${data.cover.originalname}`
        const file = await this.uploadFlowerImage(filename, data.cover.buffer)

        if (file) {
          const imageUrl = `${process.env.GS_URL}/${file}`
          newData.cover = imageUrl
        } else {
          return null
        }
      }
      const doc = db.collection('products').doc(sellerId).collection('flowers').doc(flowerName)
      // await doc.set(newData)
      await doc.set({ ...newData, caseSearch: searchParams })
      // await doc.set(data)
      return id
    } catch (error) {
      throw error
    }
  }

  async updateFlower (data, flowerId, sellerId, flowerName) {
    try {
      const isFlowerExist = await this.verifyFlowerExistById(flowerId, sellerId)
      if (!isFlowerExist) {
        throw new NotFoundError('Flower not found')
      }

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
        const coverFile = flowerData.cover ? flowerData.cover.split('/').pop() : undefined
        return coverFile
      }))

      if (filename[0] !== undefined) {
        const file = bucket.file(filename)
    
        // Check if the file exists
        const exists = await file.exists()
    
        if (exists[0]) {
          // File exists, so delete it
          await file.delete()
        } else {
          throw new NotFoundError('Image File Not Found')
        }
      }
    } catch (error) {
      throw error
    }
  }

  async createGSDirectory(directoryPath) {
    try {
      await bucket.file(directoryPath).create({ ifNotExist: true })
    } catch (error) {
      throw error
    }
  }

  async verifyFlowersExistByName(flowerName, sellerId) {
    const flowerData = await db.collection('products').doc(sellerId).collection('flowers').where('flowerName', '==', flowerName).get()
    if (!flowerData.empty) {
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

  async predictFlower(imagePredict) {
    try {
      const { originalname, buffer } = imagePredict
      const file = predictBucket.file(originalname)
      await file.save(buffer)

      const filePredict = predictBucket.file(file.name)
      const signedUrl = await filePredict.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000 // 15 minutes
      })
  
      const response = await axios.get(signedUrl[0], {
        responseType: 'arraybuffer' // Ensure the response is treated as binary data
      })
  
      const formData = new FormData()
      
      // Convert the ArrayBuffer to a Node.js Readable Stream
      const stream = new Readable()
      stream.push(Buffer.from(response.data))
      stream.push(null)
  
      formData.append('image', stream, { filename: file.name })
    
      // Make the HTTP request using axios and the FormData object
      const predictionResponse = await axios.post('https://ml-predict-casptone-m7kn4aeh5a-as.a.run.app/prediction', formData, {
        headers: {
          ...formData.getHeaders()
        },
        responseType: 'json'
      })

      const { flower_name_prediction } = predictionResponse.data.data
      const formattedFlowerName = flower_name_prediction.replace(/_/g, ' ')

      let productsData
      let flowerCatalogData
      
      try {
        flowerCatalogData = await this._catalogServices.getCatalogByName(formattedFlowerName) 
        productsData = await this.getFlowersByName(formattedFlowerName)
      } catch (error) {
        console.log(error)
      }

      return {
        predictResult: formattedFlowerName,
        flowerData: flowerCatalogData ? flowerCatalogData[0] : {},
        productsData: productsData || []
      }
    } catch (error) {
      throw error
    }
  }
}
module.exports = FlowerServices
