const Cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, '../../credentials.json')
const dotenv = require('dotenv')
dotenv.config({ path: '.env.development' })
const { Storage } = Cloud

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: process.env.PROJECT_ID
})

module.exports = storage
