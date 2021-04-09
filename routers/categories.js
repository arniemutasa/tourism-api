const express = require('express')
const {getCategory, getCategories, createCategory} = require('../controllers/categories')


const router = express.Router()

const { protect, authorize } = require('../middleware/auth')

router.route('/').get(getCategories).post(protect, authorize('publisher','admin'), createCategory)

module.exports = router