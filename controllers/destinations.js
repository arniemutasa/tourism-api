const path = require('path')
const geocoder = require('../utils/geocoder')
const Destination = require('../models/destination')
const mongoose = require('mongoose')
const ErrorResponse = require('../utils/errorResponse')





// Gets all destinations 
// GET /api/v1/destinations
// Public Access
exports.getDestinations = async (req, res, next) => {
    
    let filter = {}
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')}
    }

    try {
        const destinations = await Destination.find(filter).populate('category activities')
        res.status(200)
        .json({
            success: true,
            data: destinations
        })
    } catch (err) {
        res.status(400).json({success: false})
    }
}

// Gets single destination
// GET /api/v1/destinations/:id
// Public Access
exports.getDestination = async (req, res, next) => {


    try {
        const destination = await Destination.findById(req.params.id).populate('category activities')

        if(!destination){
            return next(new ErrorResponse(`Destination not found`, 404))
        }


        res.status(200)
        .json({
            success: true,
            data: destination
        })
    } catch (err) {
        // res.status(400).json({success: false, error: err})
        next(new ErrorResponse(`Destination not found`, 404))
    }
}


// Creates single destination
// POST /api/v1/destinations
// ADMIN ACCESS
exports.createDestination = async (req, res, next) => {

    //Add user to the request body
    req.body.user = req.user.id

       
    try{
        const destination = await Destination.create(req.body)
        res.status(201).json({success: true, data: destination})
    }catch(err){
        res.status(400).json({success: false, data: err})
    }
    
}

// Deletes single destination
// DELETE /api/v1/destinations/:id
// ADMIN ACCESS
exports.deleteDestination = async (req, res, next) => {

    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(404).send('invalid destination id')
    }
   
    try{
        let destination = await Destination.findById(req.params.id)

        // check if user is the owner or an admin user
        if(destination.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            })
        }

        destination = await Destination.findByIdAndRemove(req.params.id)


        if(!destination){
            return res.status(404).send('could not delete destination')
        } else {
            return res.status(201).json({success: true, data: destination})
        }

        
    }catch(err){
        res.status(400).json({success: false, error: err})
    }
    
}

// Updates single destination
// PUT /api/v1/destinations/:id
// ADMIN ACCESS
exports.updateDestination = async (req, res, next) => {

    const category = await Category.findById(res.post.category)

    if(!category){
        return res.status(400).send('invalid category')
    }


   
    try{
        let destination = await Destination.findById(req.params.id)

        if(!destination){
            return res.status(404).json({
                success: false,
                message: 'Destination not found'
            })
        }

        // check if user is the owner or an admin user
        if(destination.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            })
        }

        destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(201).json({success: true, data: destination})
    }catch(err){
        return res.status(500).json({success: false, message: 'Destination Update Failed'})
    }
    
}



// Get destinations within a radius
// GET /api/v1/destinations/radius/:city/:distance
// PUBLIC ACCESS
exports.getDestinationsWithinRadius = async (req, res, next) => {

    const {city, distance} = req.params

    //Get latitude and longitude from geocoder
    const loc = await geocoder.geocode(city)
    const lat = loc[0].latitude
    const lng = loc[0].longitude


    //Calculate radius using radians
    const radius = distance / 6378

    const destinations = await Destination.find({
        location: {
            $geoWithin: {$centerSphere: [[lng, lat],radius]}
        }
    })

    res.status(200).json({
        success: true,
        count: destinations.length,
        data: destinations
    })

    
}


// Upload destination photo
// PUT /api/v1/destinations/:id/photo
// ADMIN ACCESS
exports.uploadDestinationPhoto = async (req, res, next) => {

    const destination = await Destination.findById(req.params.id)

    if(!destination){
        return res.status(404).send('destination not found')
    }

    // check if user is the owner or an admin user
    if(destination.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return res.status(401).json({
            success: false,
            message: 'Not authorized'
        })
    }

    if(!req.files){
        return res.status(400).json({
            success: false,
        })
    }

    const file = req.files.file

    //check if it's a photo
    if(!file.mimetype.startsWith('image')){
        return res.status(400).json({
            success: false,
            msg: 'Not an image: Please upload an image file'
        })
    }

    //check file size
    if(file.size > process.env.MAX_FILE_SIZE){
        return res.status(400).json({
            success: false,
            msg: `File should be less than ${MAX_FILE_SIZE}bytes in size`
        })
    }

    file.name = `${destination._id}_photo${path.parse(file.name).ext}`

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err=>{
        if(err){
            console.error(err)
            return res.status(500).json(
                {
                    success: false,
                    msg: 'Problem with file upload'
                }
            )
        }

        await Destination.findByIdAndUpdate(req.params.id, {photo: file.name})

        res.status(200).json({
            success: true,
            data: file.name
        })
    })




    
}








