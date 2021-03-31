const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')


//Routers
const destinations = require('./routers/destinations')


// Load environment variables

dotenv.config({path: './config/config.env'})


const app = express()

// Connect to Database
connectDB()

 

//Mount Routers
app.use('/api/v1/destinations', destinations)


//Middleware
app.use(morgan('tiny'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running on port ${PORT}`))