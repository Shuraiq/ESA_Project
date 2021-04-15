const mongoose = require('mongoose');
const express = require("express")

const router = express.Router();
const Product = mongoose.model('Product');

router.post('/add',async(req,res) => {

    const newProduct = new Product({
        category: req.body.category,
        productName: req.body.productName,
        productModel: req.body.productModel,
        price: req.body.price,
        availableQuantity: req.body.availableQuantity
    })

    try{
        await newProduct.save()
    }catch(err){
        const error = new Error("Unable to create Product")
        error.code = 500;
        return res.status(error.code).json(error.message)
    }
    
    return res.json(newProduct);
})

router.get('/',async (req,res)=>{
    var products
    try{
        products = await Product.find({})
    }catch(err){
        const error = new Error("Unable to find products")
        error.code = 500;
        return res.status(error.code).json(error.message)
    }
    return res.status(200).json(products)
})
module.exports = router