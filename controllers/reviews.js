const Review = require('../models/review')
const Destination = require('../models/destination')
const Activity = require('../models/activity')





// Gets all reviews
// GET /api/v1/reviews
// Public Access
exports.reviews = async (req, res, next) =>{
    const reviews = await Review.find().populate('destination activity')
    if(!reviews){
        return res.status(404).json({
            success: false,
            message: 'No Reviews Found'
        })
    }

    res.status(200).json({
        success:true,
        data: reviews
    })

}

// Gets all reviews for a single activity
// GET /api/v1/reviews/:activityId
// Public Access
exports.getActivityReviews = async (req, res, next) =>{
    const activity = req.params.activityId

    

    const reviews = await Review.find({
        activity : req.params.activityId
    })

    if(!reviews){
        return res.status(404).json({
            success: false,
            message: 'Reviews not found'
        })
    }

    res.status(200).json({
        success: true,
        data: reviews
    })
}


// Gets all reviews for a single destination
// GET /api/v1/reviews/:destinationId
// Public Access
exports.getDestinationReviews = async (req, res, next) =>{
    const activity = req.params.destinationId

    const reviews = await Destination.find({
        activity : req.params.destinationId
    })

    if(!reviews){
        return res.status(404).json({
            success: false,
            message: 'Reviews not found'
        })
    }

    res.status(200).json({
        success: true,
        data: reviews
    })
}



// Gets single review
// GET /api/v1/reviews/:id
// Public Access
exports.getReview = async (req, res, next) =>{
    const review = await Review.findById(req.params.id).populate({
        path: 'destination activity',
        select: 'name description'
    })
    if(!review){
        return res.status(404).json({
            success: false,
            message: 'No Reviews Found'
        })
    }

    res.status(200).json({
        success:true,
        data: review
    })

}






// Adds new review
// POST /api/v1/reviews
// Private Access
exports.addReview = async (req, res, next)=>{
    const destination = await Destination.findById(req.body.destination)
    if(!destination){
        return res.status(400).json({
            success: false,
            message: 'Please enter valid destination'
        })
    }


    const activity = await Activity.findById(req.body.activity)
    if(!destination){
        return res.status(400).json({
            success: false,
            message: 'Please enter valid destination'
        })
    }

    const review = await Review.create(req.body)

    if(!review){
        return res.status(400).json({
            success: false,
            message: 'Please enter valid destination'
        })
    }

    res.status(200).json({
        success: true,
        data: review
    })


}




// Adds new review
// POST /api/v1/destinations/:destinationId/reviews
// Private Access
exports.addReviewToDestination = async (req, res, next)=>{
    req.body.destination = req.params.destinationId
    req.body.user = req.user.id

    const destination = await Destination.findById(req.body.destination)
    if(!destination){
        return res.status(400).json({
            success: false,
            message: 'Please enter valid destination'
        })
    }


    const review = await Review.create(req.body)

    if(!review){
        return res.status(400).json({
            success: false,
            message: 'Please enter valid destination'
        })
    }

    res.status(201).json({
        success: true,
        data: review
    })


}






// Adds new review
// POST /api/v1/activity/:activityId/reviews
// Private Access
exports.addReviewToActivity = async (req, res, next)=>{
    req.body.activity = req.params.activityId
    req.body.user = req.user.id

    const activity = await Activity.findById(req.body.activity)
    if(!activity){
        return res.status(400).json({
            success: false,
            message: 'Please enter valid activity'
        })
    }


    const review = await Review.create(req.body)

    if(!review){
        return res.status(400).json({
            success: false,
            message: 'Please enter valid destination'
        })
    }

    res.status(201).json({
        success: true,
        data: review
    })


}



// Update single review
// PUT /api/v1/reviews/:id
// Private Access
exports.updateReview = async (req, res, next) =>{
    let review = await Review.findById(req.params.id).populate({
        path: 'destination activity',
        select: 'name description'
    })

    console.log(review.user.toString())


    if(!review){
        return res.status(404).json({
            success: false,
            message: 'No Reviews Found'
        })
    }

    if(review.user.toString() !== req.user.id && req.user.role !== 'Admin'){
        return res.status(401).json({
            success: false,
            message: 'Access Denied'
        })
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success:true,
        data: review
    })

}




// Delete single review
// PUT /api/v1/reviews/:id
// Private Access
exports.deleteReview = async (req, res, next) =>{
    const review = await Review.findById(req.params.id).populate({
        path: 'destination activity',
        select: 'name description'
    })


    if(!review){
        return res.status(404).json({
            success: false,
            message: 'No Reviews Found'
        })
    }

    if(review.user.toString() !== req.user.id && req.user.role !== 'Admin'){
        return res.status(401).json({
            success: false,
            message: 'Access Denied'
        })
    }

    await review.remove()

    res.status(200).json({
        success:true,
        data: review
    })

}