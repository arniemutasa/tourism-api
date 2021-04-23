const jwt = require('jsonwebtoken')
const User = require('../models/user')


exports.protect = async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    } 

    else if(req.cookies.token){
        token = req.cookies.token
    }

    if(!token){
        return res.status(401).json({

            success: false,
            msg: 'Not Authorized'
        })
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id)
        console.log(req.user.role)

        next()
        
    } catch (err) {
        return res.status(401).json({

            success: false,
            msg: 'Not Authorized'
        })
    }
}


exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success: false,
                msg: 'User not authorized'
            })
        }

        next()
    }
}