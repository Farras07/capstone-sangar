/* eslint-disable no-unused-vars */
const express = require('express')
const app = express()
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const ClientError = require('./exceptions/ClientError')

const authRoutes = require('./routes/authRoutes.js')
const authenticate = require('./middleware/authenticate.js')

const flowers = require('./api/flower')
const seller = require('./api/seller')

dotenv.config({ path: '.env.development' })
const host = process.env.HOST
const port = process.env.PORT

app.use(bodyParser.json())

// app.use((err, req, res, next) => {
//   if (err instanceof ClientError) {
//     return res.status(err.statusCode).json({
//       status: 'fail',
//       message: err.message
//     })
//   }
//   return res.status(500).json({
//     status: 'error',
//     message: 'Terjadi kegagalan pada server kami'
//   })
// })
app.use('/auth', authRoutes)

app.use('/flower', flowers)
app.use('/seller', seller)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user })
})

app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`)
})
