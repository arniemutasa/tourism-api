const express = require('express')
const { getDestinations, getDestination, createDestination, getDestinationsWithinRadius, uploadDestinationPhoto } = require('../controllers/destinations')






//Include Activities router for fetching activities belonging to destination
const activitiesRouter = require('./activities')


const router = express.Router();





const { protect, authorize } = require('../middleware/auth')


// Re Route to activities router
router.use('/:destinationId/activities', activitiesRouter)

router.route('/')
.get(getDestinations)
.post(protect, authorize('publisher','admin'), createDestination)


router.route('/:id').get(getDestination)


router.route('/radius/:city/:distance').get(getDestinationsWithinRadius)

router.route('/:id/photo').put(protect, authorize('publisher','admin'), uploadDestinationPhoto)



module.exports = router