const mongoose = require('mongoose')


const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    colour: {
        type: String
    },
    icon: {
        type: String
    },
})

categorySchema.virtual('id').get(function(){
    return this._id.toHexString()
})

categorySchema.set('toJSON', {
    virtuals: true,
})


module.exports = mongoose.model('Category',categorySchema);