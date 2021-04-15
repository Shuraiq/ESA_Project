const express = require('express');
const mongoose  = require('mongoose');
const router = express.Router();
const Cart = mongoose.model('Cart');
const User = mongoose.model('User');
const Product = mongoose.model('Product');

router.put('/add',async(req,res) => {

    let user
    try{
        user = await User.findById(req.body.userId).populate('cart');
    }catch(err){
        const error = new Error("Could not find user")
        error.code = 500;
        return res.status(error.code).json(error.message)
    }
    if(!user){
        const error = new Error("Could not find user")
        error.code = 500;
        return res.status(error.code).json(error.message)
    }

    let product
    try{
        product = await Product.findById(req.body.productId);
    }catch(err){
        const error = new Error("No such product registered")
        error.code = 500;
        return res.status(error.code).json(error.message)
    }
    if(!product){
        const error = new Error("No such product registered")
        error.code = 500;
        return res.status(error.code).json(error.message)
    }  

    const cartItems = user.cart
    if (user.cart.length == 0){
        if(product.availableQuantity < req.body.wantedQuantity){
            const error = new Error("Required amount of products unavailable")
            error.code = 500;
            return res.status(error.code).json(error.message)
        }
    
        let presentQuantity = product.availableQuantity-req.body.wantedQuantity
        product.availableQuantity = presentQuantity
        const newCart = new Cart({
            productName: product.productName,
            productId: product.id,
            quantity: req.body.wantedQuantity,
            amount: req.body.wantedQuantity*product.price
        })
    
        try{
            const sess = await mongoose.startSession();
            await sess.startTransaction();
            await newCart.save({session:sess})
            await product.save()
            user.cart.push(newCart);
            await user.save();
            await sess.commitTransaction();
        }catch(err){
            const error = new Error("Unable to make changes to cart")
            error.code = 500;
            return res.status(error.code).json(error.message)
        }
        
        return res.json("Added successfully");
    }

    var itemPresent = false
    let cartItem
    for(let i=0; i<cartItems.length;i++){
        if(cartItems[i].productId == req.body.productId){
            itemPresent = true
            cartItem = cartItems[i]
            break 
        }
    }

    if (!itemPresent){
        if(product.availableQuantity < req.body.wantedQuantity){
            const error = new Error("Required amount of products unavailable")
            error.code = 500;
            return res.status(error.code).json(error.message)
        }
    
        let presentQuantity = product.availableQuantity-req.body.wantedQuantity
        product.availableQuantity = presentQuantity
        const newCart = new Cart({
            productName: product.productName,
            productId: product.id,
            quantity: req.body.wantedQuantity,
            amount: req.body.wantedQuantity*product.price
        })
    
        try{
            const sess = await mongoose.startSession();
            await sess.startTransaction();
            await newCart.save({session:sess})
            await product.save()
            user.cart.push(newCart);
            await user.save();
            await sess.commitTransaction();
        }catch(err){
            const error = new Error("Unable to make changes to cart")
            error.code = 500;
            return res.status(error.code).json(error.message)
        }
        
        return res.json("Added successfully");
    }
    else{
         var extraQuantity = req.body.wantedQuantity-cartItem.quantity
         if(product.availableQuantity<extraQuantity){
            const error = new Error("Required amount of products unavailable")
            error.code = 500;
            return res.status(error.code).json(error.message)
         }
         cartItem.quantity = req.body.wantedQuantity
         product.availableQuantity = product.availableQuantity - extraQuantity

         try{
            const sess = await mongoose.startSession();
            await sess.startTransaction();
            await cartItem.save()
            await product.save()
            await sess.commitTransaction();
        }catch(err){
            const error = new Error("Unable to make changes to cart")
            error.code = 500;
            return res.status(error.code).json(error.message)
        }
        
        return res.json("Added sccessfully");
    }
})

router.get("/:uid",async(req,res) => {
    let user
    try{
        user = await User.findById(req.params.uid).populate('cart');
    }catch(err){
        const error = new Error("Could not find user")
        error.code = 500;
        return res.status(error.code).json(error.message)
    }
    if(!user){
        const error = new Error("Could not find user")
        error.code = 500;
        return res.status(error.code).json(error.message)
    }
    return res.json(user.cart)
})

module.exports = router