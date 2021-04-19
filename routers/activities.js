const express = require('express')
const Activity = require('../models/activity')
const { getActivities, getActivity, createActivity, updateActivity, deleteActivity, getActivityByCost } = require('../controllers/activities')




const router = express.Router({mergeParams: true})

const { protect, authorize } = require('../middleware/auth')


router.route('/').get(getActivities).post(protect, authorize('publisher','admin'), createActivity)
router.route('/:id').get(getActivity).delete(protect, authorize('publisher','admin'), deleteActivity)
.put(protect, authorize('publisher','admin'), updateActivity)

router.route('/cost/:cost').get(getActivityByCost)

module.exports = router