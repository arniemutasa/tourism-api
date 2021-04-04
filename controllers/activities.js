const mongoose = require('mongoose')
const Activity = require('../models/activity')
const Destination = require('../models/destination')



// Gets all activities
// GET /api/v1/activities
// Public Access
exports.getActivities = async (req, res, next) => {


    let query;

    if(req.params.destinationId){
        query = Activity.find({
            destination: req.params.destinationId
        }).populate('destination')
    }else{
        query = Activity.find().populate('destination')
    }


    const activities = await query
    if(!activities){
        return res.status('400').json({
            success: false,
            data: 'No Activities'
        })
    }

    res.status(200).json({
        success: true,
        data: activities
    })

}

// Gets single activity
// GET /api/v1/activites/:id
// Public Access
exports.getActivity = async (req, res, next) => {
    const activity = await Activity.findById(req.params.id).populate('destination')
    if(!activity){
        return res.status('400').json({
            success: false,
            data: 'Activity not found'
        })
    }

    res.status(200).json({
        success: true,
        data: activity
    })

}


// Creates single activity
// POST /api/v1/activities
// Admin Access
exports.createActivity = async (req, res, next) => {
    
    const destination = await Destination.findById(req.body.destination)

    if(!destination){
        return res.status(404).json({
            success: false,
            message: 'Destination does not exist'
        })
    }

    const activity = await Activity.create(req.body)

    if(!activity){
        return res.status(500).json({
            success: false,
            data: 'Activity not created'
        })
    }

    res.status(200).json({
        success: true,
        data: activity
    })
}


// Updates single activity
// PUT /api/v1/activites/:id
// Admin Access
exports.updateActivity = async (req, res, next) => {

    const activity = await Activity.findByIdAndUpdate(req.params.id)
    
    if(!activity){
        return res.status(404).json({
            success: false,
            data: 'Activity not updated'
        })
    }

    res.status(200).json({
        success: true,
        data: activity
    })
}

// Deletes single activity
// DELETE /api/v1/activities/:id
// Admin Access
exports.deleteActivity = async (req, res, next) => {
    const activity = await Activity.findByIdAndRemove(req.params.id)
    
    if(!activity){
        return res.status(500).json({
            success: false,
            data: 'Activity not found'
        })
    }

    res.status(200).json({
        success: true,
        data: activity
    })
}



