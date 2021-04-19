const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    title: {
        type: String,
        required: [true, 'Please add a title for your review']
    },

    text: {
        type: String,
        required: [true, 'Please enter your review']
    },

    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please enter your rating']
    },

    activity: {
        type: mongoose.Schema.ObjectId,
        ref: 'Activity'
    },

    destination: {
        type: mongoose.Schema.ObjectId,
        ref: 'Destination',
    }

})


//limits one user to one review per desination/activity
reviewSchema.index({ destination: 1, user:1 }, {unique: true})
reviewSchema.index({ activity: 1, user:1 }, {unique: true})



//get average rating
reviewSchema.statics.getAverageRating = async function(activityId){
    const obj = this.aggregate([
        {
            $match: {activity: activityId}
        },
        {
            $group: {
                _id: '$activity',
                rating: {$avg: '$rating'}
            }
        }
    ])

    try {
        await this.Model('Activity').findByIdAndUpdate(activityId, {
            average: obj[0].average
        })
        
    } catch (error) {
        console.log(error)
    }
}

//call getAverageRating before save and after remove
reviewSchema.post('save', function(){
    this.constructor.getAverageRating(this.activity)
})

reviewSchema.pre('remove', function(){
    this.constructor.getAverageRating(this.activity)
})



module.exports = mongoose.model('Review', reviewSchema)