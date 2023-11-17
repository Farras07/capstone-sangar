const express = require('express')
const authenticate = require('../middleware/authenticate.js')
const authController = require('../controllers/authController.js')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/logout', authenticate, authController.logout)

module.exports = router
