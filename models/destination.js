const mongoose = require('mongoose')
const slugify = require('slugify')
const geocoder = require('../utils/geocoder')


const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter Destination Name'],
        unique: true
    },
    slug: {

    },
    description: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    website: {
        type: String
        
    },
    phone: {
        type: String
    },
    email: {
        type: String,
    },
    address: {
        type: String,
        required: [true, 'Please enter the address of the destination']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: {
            type: String
        },
        street: {
            type: String
        },
        city: {
            type: String
        },
        state: {
            type: String
        },
        zipcode: {
            type: String
        },
        country: {
            type: String
        }
    },
    photo: {
        type: String,
        default: 'no-logo.jpg'
    },

    images: [
        {
            type: String
        }
    ],

    averageActivityCost: {
        type: Number
    },

    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot go below 1'],
        max: [10, 'Rating cannot go above 10']
    },
    reviews: {
        type: Number
    },

    dateCreated: {
        type: Date,
        default: Date.now()
    }
})

destinationSchema.virtual('id').get(function(){
    return this._id.toHexString()
})

destinationSchema.virtual('activities',{
    ref: 'Activity',
    localField: '_id',
    foreignField: 'destination',
    justOne: false
})

destinationSchema.set('toJSON', {
    virtuals: true,
})

destinationSchema.set('toObject', {
    virtuals: true,
})

// Create Slug from Name
destinationSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true})
    next()
})


// Create location
destinationSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address)

    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipCode,
        country: loc[0].countryCode
    }

    next()
})



module.exports = mongoose.model('Destination', destinationSchema)