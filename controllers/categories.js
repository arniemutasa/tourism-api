const Category = require('../models/category')

// Gets all categories 
// GET /api/v1/categories
// Public Access
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find()
        res.status(200)
        .json({
            success: true,
            data: categories
        })
    } catch (err) {
        res.status(400).json({success: false})
    }
}


// Gets single category
// GET /api/v1/categories/:id
// Public Access
exports.getCategory = async (req, res, next) => {
    try {
        const category = await Category.findById()
        res.status(200)
        .json({
            success: true,
            data: category
        })
    } catch (err) {
        res.status(400).json({success: false})
    }
}

// Creates single destination
// POST /api/v1/destinations
// ADMIN ACCESS
exports.createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body)
        res.status(200)
        .json({
            success: true,
            data: category
        })
    } catch (err) {
        res.status(400).json({success: false})
    }
}

// Deletes single category
// DELETE /api/v1/categories/:id
// ADMIN ACCESS
exports.deleteCategory = async (req, res, next) => {
   
    try{
        const category = await Category.findByIdAndRemove(req.params.id)
        res.status(201).json({success: true, data: category})
    }catch(err){
        res.status(400).json({success: false})
    }
    
}


