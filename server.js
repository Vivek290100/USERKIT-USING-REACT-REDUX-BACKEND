const express = require('express')
const cors = require('cors')
const {connectDB} = require('./config/mongodb')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')
const errorHandler = require('./middleware/errorHandler')
const path = require('path'); 
require('dotenv').config();
const morgan = require('morgan')


const app = express()
app.use(morgan("dev"))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));

app.use(express.json())
app.use(express.static('public'));


connectDB()

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/auth',authRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/user',userRoutes)
app.use('/displaypictures',express.static('public'))



app.use(errorHandler)




const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`http://localhost:${PORT}`)
}).on('error',(err)=>{
    console.log('Failed to start server:',err)
})