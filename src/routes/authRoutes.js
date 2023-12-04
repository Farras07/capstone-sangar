const express = require('express')
const authController = require('../controllers/authController.js')

const router = express.Router()

// router.post('/signup', upload.single('cover'), authController.signup)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/reset-password', authController.resetPassword)
router.post('/refresh-token', authController.refreshAccessToken)

module.exports = router
