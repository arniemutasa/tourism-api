const express = require('express')
const {getCategory, getCategories, createCategory} = require('../controllers/categories')


const router = express.Router()


router.route('/').get(getCategories).post(createCategory)

module.exports = router