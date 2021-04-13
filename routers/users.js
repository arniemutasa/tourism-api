const express = require('express')
const { getUsers } = require('../controllers/auth')
const {  getUser, updateUser } = require('../controllers/users')
const { protect, authorize } = require('../middleware/auth')


const router = express.Router()



router.route('/:id').get(protect, getUser).put(protect, authorize('admin'), updateUser)
router.route('').get(protect, getUsers)


module.exports = router



