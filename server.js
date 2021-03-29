const express = require('express')
const dotenv = require('dotenv')


//Routers
const destinations = require('./routers/destinations')


// Load environment variables

dotenv.config({path: './config/config.env'})


const app = express()
 

//Mount Routers
app.use('/api/v1/destinations', destinations)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running on port ${PORT}`))