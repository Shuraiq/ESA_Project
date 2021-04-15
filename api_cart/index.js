require('./models/cart');
require('./models/product');
require('./models/user');
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const cartroute = require('./routes/cart')

require('dotenv').config();

app.use(express.json());


const port = 8000;

app.use('/api/cart',cartroute)

mongoose.connect(process.env.MONGO_URL,{
    useCreateIndex: true,
    useUnifiedTopology: true, 
    useNewUrlParser: true 
})


mongoose.connection.on('connected',() => {
   console.log("connected to database")
})


mongoose.connection.on('error',() => {
   console.log("database connection failed");
})



app.listen(port,(req,res) => {
    console.log("listening on port 8000")
})