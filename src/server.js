/* eslint-disable no-unused-vars */
const express = require('express')
const app = express()
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
const csv = require('csv-parser')
const fs = require('fs')
const db = require('./config/dbConfig')
const { nanoid } = require('nanoid')

const authRoutes = require('./routes/authRoutes.js')
const authenticate = require('./middleware/authenticate.js')
const search = require('./api/search')
const flowers = require('./api/flower')
const users = require('./api/user')
const seller = require('./api/seller')
const transaction = require('./api/transaction')
const cart = require('./api/cart')
const wishlist = require('./api/wishlist')
const catalog = require('./api/catalog')

dotenv.config({ path: '.env.development' })
const host = process.env.HOST
const port = process.env.port || 3000

app.use(cors())
app.use(bodyParser.json())

app.use('/auth', authRoutes)
app.use('/search', search)
app.use('/flower', flowers)
app.use('/seller', seller)
app.use('/user', users)
app.use('/transaction', transaction)
app.use('/cart', cart)
app.use('/wishlist', wishlist)
app.use('/catalog', catalog)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user })
})

app.post('/import', (req, res) => {
  try {
    fs.createReadStream('databunga.csv')
      .pipe(csv())
      .on('data', async (data) => {
        const id = `catalog-${nanoid(10)}`
        console.log(data)
        await db.collection('katalog').doc(data.localName).set({...data, id })
      })
      .on('end', () => {
        res.send('CSV file successfully processed')
      })
  } catch (error) {
    console.log(error)
  }
})

// app.post('/regis', async (req, res) => {
//   try {
//     const FormData = require('form-data')    
//     const formData = new FormData()
  
//     formData.append('fullname', 'surya1234')
//     formData.append('username', 'surya1234')
//     formData.append('email', 'surya1234@gmail.com')
//     formData.append('password', '123456789')
//     formData.append('address', 'Jl.Kalimantan No.180')
//     formData.append('locationLatitude', 77)
//     formData.append('locationLongitude', -10)
//     formData.append('contact', '089374748')
//     const predictionResponse = await axios.post('https://backend-cloud-run-1-m7kn4aeh5a-as.a.run.app/user', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       },
//       responseType: 'json'
//     })
//     console.log(predictionResponse)
//     res.send({
//       status: 'success',
//       data: predictionResponse.data
//     })
//   } catch (error) {
//     res.send({
//       status: 'fail',
//       message: error.message
//     })
//   }
// })

app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`)
})
