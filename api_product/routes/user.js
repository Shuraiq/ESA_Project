const mongoose = require('mongoose');
const User = mongoose.model('User')
const express = require("express")
const router = express.Router();

router.post('/signup',async(req,res) => {
    const hasUsername = await User.find({username: req.body.username})
    if(hasUsername.length !== 0){
        const error = new Error("This username is already taken")
        error.code = 422;
       return res.status(error.code).json(error.message)
    }

    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        cart:[]
    })

    try{
        await newUser.save();
    }catch(err){
        const error = new Error("Something went wrong while signup")
        error.code = 500;
       return res.status(error.code).json(error.message)
    }

    return res.json("Successfully signed up")  
})


module.exports = router