/* eslint-disable no-useless-escape */
const Firestore = require('@google-cloud/firestore')
const dotenv = require('dotenv')
dotenv.config({ path: '.env.development' })
const path = require('path')
const serviceKey = path.join(__dirname, '../../credentials.json')

const db = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: serviceKey
  // keyFilename: 'C:\\Users\\Admin\\OneDrive\\Documents\\GitHub\\capstone-sangar\\credentials.json'
})

module.exports = db
