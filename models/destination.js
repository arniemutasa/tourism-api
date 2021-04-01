const mongoose = require('mongoose')
const slugify = require('slugify')


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

destinationSchema.set('toJSON', {
    virtuals: true,
})

// Create Slug from Name
destinationSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true})
    next()
})

module.exports = mongoose.model('Destination', destinationSchema)