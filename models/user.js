const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please select a username'],
        unique: [true, 'Username must be unique']
    },

    firstName: {
        type: String,
        required: [true, 'Please select a username']
    },

    lastName: {
        type: String,
        required: [true, 'Please select a username']
    },

    email: {
        type: String,
        required: [true, 'Please select a username'],
        unique: [true, 'Username must be unique'],
        match: [/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        'Please enter a valid email address']
    },
    role: {
        type: String,
        enum: ['user', 'publisher','admin'],
        default: 'user'

    },

    password: {
        type: String,
        required: [true, 'Please select password'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordTokenExpiry: {
        Type: Date
    },

    dateCreated: {
        type: Date,
        default: Date.now
    }
})

//hash password
userSchema.pre('save', async function(next){

    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Compare hashed password with user entered password on login
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)    
}

//Web Token
userSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({
        id: this._id
    },
    process.env.JWT_SECRET,
    {
        expiresIn: '30d',
    }
    )
}

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex')

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordTokenExpiry = Date.now() + 10*60*1000

    return resetToken
}


module.exports = mongoose.model('User', userSchema)