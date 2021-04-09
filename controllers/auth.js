const User = require('../models/user')






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