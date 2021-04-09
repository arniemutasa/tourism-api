const express = require('express')
const {register, login, getLoggedInUser, getUsers} = require('../controllers/auth')
const { protect } = require('../middleware/auth')

const router = express.Router()




router.route('/register').post(register)
router.route('/login').post(login)
router.route('/me').get(protect, getLoggedInUser)
router.route('/api/v1/users').get(getUsers)

module.exports = router