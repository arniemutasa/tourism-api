const express = require('express')
const { getDestinations, getDestination, createDestination, getDestinationsWithinRadius, uploadDestinationPhoto } = require('../controllers/destinations')

//Include Activities router for fetching activities belonging to destination
const activitiesRouter = require('./activities')


const router = express.Router();

// Re Route to activities router
router.use('/:destinationId/activities', activitiesRouter)

router.route('/')
.get(getDestinations)
.post(createDestination)


router.route('/:id').get(getDestination)


router.route('/radius/:city/:distance').get(getDestinationsWithinRadius)

router.route('/:id/photo').put(uploadDestinationPhoto)



module.exports = router