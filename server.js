const express = require('express')
const cors = require('cors')
const {connectDB} = require('./config/mongodb')
const authRoutes = require('./routes/authRoutes')
const errorHandler = require('./middleware/errorHandler')
require('dotenv').config();


const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));

app.use(express.json())

connectDB()

app.use('/api/auth',authRoutes)


app.use(errorHandler)




const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
}).on('error',(err)=>{
    console.log('Failed to start server:',err)
})