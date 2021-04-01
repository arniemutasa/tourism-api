const errorHandler = (err, req, res, next) => {
    console.log(err.stack.red)
    // if(res.headersSent){
    //     return next(err)
    // }
    res.status(err.statusCode || 500).json({success: false, error: err.message || 'Server Error'})
    // res.render('error', {error: err})
}


module.exports = errorHandler