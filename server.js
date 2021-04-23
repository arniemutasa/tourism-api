const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const fileupload = require('express-fileupload')
const errorHandler = require('./middleware/error')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')



//Routers
const destinations = require('./routers/destinations')
const categories = require('./routers/categories')
const activities = require('./routers/activities')
const reviews = require('./routers/reviews')
const users = require('./routers/users')
const auth = require('./routers/auth')


// Load environment variables

dotenv.config({path: './config/config.env'})


const app = express()

// Connect to Database
connectDB()

//JSON Body Parser
app.use(express.json())

//Cookie Parser
app.use(cookieParser())

//File Uploads
app.use(fileupload())

//Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS Attacks
app.use(xssClean())

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100

})

app.use(limiter)

// Prevent HPP param polution
app.use(hpp())

//Enable cors
app.use(cors())

//Set static folder
app.use(express.static(path.join(__dirname,'public')))

//Mount Routers
app.use('/api/v1/destinations', destinations)
app.use('/api/v1/categories', categories)
app.use('/api/v1/activities', activities)
app.use('/api/v1/reviews', reviews)
app.use('/api/v1/users', users)
app.use('', auth)


//Middleware
app.use(morgan('tiny'))
app.use(errorHandler)



const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running on port ${PORT}`))