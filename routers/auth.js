const express = require('express')
const {register, login, getLoggedInUser, getUsers, forgotPassword, resetPassword, updateUserDetails, updatePassword} = require('../controllers/auth')
const { protect } = require('../middleware/auth')

const router = express.Router()




router.route('/register').post(register)
router.route('/login').post(login)
router.route('/me').get(protect, getLoggedInUser)
router.route('/me/updatedetails').put(protect, updateUserDetails)
router.route('/me/updatepassword').put(protect, updatePassword)
router.route('/forgotpassword').post(forgotPassword)
router.route('/resetpassword/:resettoken').put(resetPassword)
router.route('/api/v1/users').get(getUsers)

module.exports = router

