const express = require('express')
const { getDestinations, getDestination, createDestination } = require('../controllers/destinations')

const router = express.Router();

router.route('/')
.get(getDestinations)
.post(createDestination)


router.route('/:id').get(getDestination)



module.exports = router