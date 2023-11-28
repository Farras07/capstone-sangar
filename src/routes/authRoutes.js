const express = require('express')
const authController = require('../controllers/authController.js')
const multer = require('multer')

const router = express.Router()
const upload = multer()

// router.post('/signup', upload.single('cover'), authController.signup)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

module.exports = router
