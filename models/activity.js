const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    name: {
        type: String,
        required: [true, 'Please enter name']
    },

    description: {
        type: String,
        required: [true, 'Please enter description ']
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },

    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination'
    },

    rating: {
        type: Number,
        min: 0,
        max: 10
    },

    images: [{
        type: String
    }],

    reviews: {
        type: Number
    },

    price: {
        type: Number,
        min: 0
    },

    isAdultActivity: {
        type: Boolean
    },

    dateCreated: {
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model('Activity', activitySchema)