const express = require('express')
const Review = require('../models/review')
const { reviews, addReview, getActivityReviews, getDestinationReviews, getReview, addReviewToDestination, addReviewToActivity } = require('../controllers/reviews')
const { protect } = require('../middleware/auth')

const router = express.Router()


router.route('/').get(reviews).post(addReviewToDestination)
router.route('/:id').get(getReview)
router.route('/destination/:destinationId').get(getDestinationReviews).post(protect, addReviewToDestination)
router.route('/activity/:activityId').get(getActivityReviews).post(protect, addReviewToActivity)


module.exports = router