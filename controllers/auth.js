const User = require('../models/user')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')






// Get All Users
// Get /api/v1/users
// Public Access
exports.getUsers = async (req, res, next)=>{
    const users = await User.find()

    res.status(200).json({
        success: true,
        data: users
    })
}

// Register new user
// POST /register
// Public Access
exports.register = async (req, res, next) => {

    const {username, firstName, lastName, email, password, role} = req.body

    // create user
    const user = await User.create(
        {
            username,
            firstName,
            lastName,
            email,
            password,
            role
        }
    )

    sendTokenResponse(user, 200, res)
}



// Login registered user
// POST /login
// Public Access
exports.login = async (req, res, next) => {

    const {email, password } = req.body

    // Validate Email and Password
    if(!email || !password){
        return res.status(400).json({
            success: false,
            msg: 'Please provide email and password'
        })
    }

    // Verify user
    const user = await User.findOne({email: email}).select('+password')

    if(!user){
        return res.status(401).json({
            success: false,
            msg: 'Invalid Credentials'
        })
    }

    // validate password
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return res.status(401).json({
            success: false,
            msg: 'Invalid Credentials'
        })
    }


    sendTokenResponse(user, 200, res)

    
}


// Create token and add to cookie 
const sendTokenResponse = (user, statusCode, res) => {

    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + 30*24*60*60*1000),
        httpOnly: true
    }

    res.status(statusCode)
    .cookie('token', token, options).json({success:true})
}

// Get registered user
// GET /me
// Private
exports.getLoggedInUser = async (req, res, next) => {

    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
}

// Forgot Password
// GET /forgotpassword
// Public Access
exports.forgotPassword = async (req, res, next) => {

    // get user from email 
    let user = await User.findOne({email: req.body.email})

    if(!user){
        return res.status(404).json({
            success: false,
            message: `User with email ${req.body.email} does not exist`
        })
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`

    const options = {
        email: user.email,
        subject: 'Reset Your Password',
        message: `Follow this link ${resetUrl} to reset your password`

    }

    try {
        await sendEmail(options)
        res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpiry = undefined

        await user.save({ validateBeforeSave: false })

        res.status(500).json({
            success: false,
            message: error
        })
        
    }
    

    
}


// Reset Password
// PUT /resetpassword
// Public Access
exports.resetPassword = async (req, res, next) => {

    const hashedToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')
    
    let user = await User.findOne({
        resetPasswordToken: hashedToken
    })

    if(!user){
        res.status(400).json({
            success: false,
            message: 'Invalid Token'
        })
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpiry = undefined
    await user.save()

    sendTokenResponse(user, 200, res)

    
}



// Update user
// PUT /me/updatedetails
// Private
exports.updateUserDetails = async (req, res, next) => {

    const fieldsToUpdate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate,{
        new: true,
        runValidators: false
    })

    res.status(200).json({
        success: true,
        data: user
    })
}


// Update user password
// PUT /me/updatepassword
// Private
exports.updatePassword = async (req, res, next) => {

    
    const user = await User.findById(req.user.id).select('+password')

    // Check if new password matches old password

    if(!(await user.matchPassword(req.body.currentPassword))){
        return res.status(404).json({
            success: false,
            message: 'Incorrect Password'
        })
    }

    // update password
    user.password = req.body.newPassword
    await user.save()

    sendTokenResponse(user, 200, res)

    
}