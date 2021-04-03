const express = require('express')
const Activity = require('../models/activity')
const { getActivities, getActivity, createActivity, updateActivity, deleteActivity } = require('../controllers/activities')




const router = express.Router({mergeParams: true})



router.route('/').get(getActivities).post(createActivity)
router.route('/:id').get(getActivity).delete(deleteActivity).put(updateActivity)

module.exports = router