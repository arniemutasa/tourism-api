const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')


//Routers
const destinations = require('./routers/destinations')
const categories = require('./routers/categories')


// Load environment variables

dotenv.config({path: './config/config.env'})


const app = express()

// Connect to Database
connectDB()

//JSON Body Parser
app.use(express.json())

//Mount Routers
app.use('/api/v1/destinations', destinations)
app.use('/api/v1/categories', categories)


//Middleware
app.use(morgan('tiny'))
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running on port ${PORT}`))