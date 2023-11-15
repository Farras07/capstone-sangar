/* eslint-disable no-useless-escape */
const Firestore = require('@google-cloud/firestore')
const dotenv = require('dotenv')
dotenv.config({ path: '.env.development' })

const db = new Firestore({
  projectId: process.env.PROJECT_ID,
  keyFilename: 'C:\\Back-end\\capstone-sangar\\credentials.json'
})

module.exports = db
