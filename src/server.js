const express = require('express')
const app = express()
const dotenv = require('dotenv')
const bodyParser = require('body-parser')

const flowers = require('./api/flower')
const seller = require('./api/seller')

dotenv.config({ path: '.env.development' })
const host = process.env.HOST
const port = process.env.PORT

app.use(bodyParser.json())

app.use('/flower', flowers)
app.use('/seller', seller)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`)
})
