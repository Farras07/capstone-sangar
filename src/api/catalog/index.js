const express = require('express')
const router = express.Router()
const CatalogHandler = require('./handler')
const CatalogServices = require('../../services/catalogServices')
const catalogServices = new CatalogServices()
const handler = new CatalogHandler(catalogServices)

router.get('/flower', async (req, res) => {
  try {
    const { flowerName } = req.query
    let data = null
    if (!flowerName) {
      data = await handler.getCatalogHandler()
    } else {
      const formattedFlowerName = flowerName.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
      data = await handler.getCatalogFlowerByNameHandler(formattedFlowerName)
    }
    res.status(200).json(
      {
        status: 'success',
        message: 'Success get catalog',
        data
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})

router.get('/flower/:id', async (req, res) => {
  try {
    const { id: idCatalogFlower } = req.params
    const data = await handler.getCatalogFlowerByIdHandler(idCatalogFlower)
    res.status(200).json(
      {
        status: 'success',
        message: 'Success get catalog',
        data
      }
    )
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: 'Fail',
      message: error.message
    })
  }
})

module.exports = router
