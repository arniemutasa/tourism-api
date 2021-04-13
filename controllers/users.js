const User = require('../models/user')





// Update User
// POST /api/v1/users/update/:id
// Private Access
exports.updateUser = async (req, res, next) => {

     
    try{
        let user = await User.findById(req.params.id)

        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        

        user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(201).json({success: true, data: user})
    }catch(err){
        return res.status(500).json({success: false, message: 'User Update Failed'})
    }
    
}


// Get All Users
// Get /api/v1/users
// Private Access
exports.getUsers = async (req, res, next)=>{
    const users = await User.find()

    res.status(200).json({
        success: true,
        data: users
    })
}

// Get Single User
// GET /api/v1/users/:id
// Private
exports.getUser = async (req, res, next) => {

    const user = await User.findById(req.params.id)

    res.status(200).json({
        success: true,
        data: user
    })
}

