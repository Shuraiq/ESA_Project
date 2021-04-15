const mongoose = require('mongoose');
const express = require("express")

const router = express.Router();
const Product = mongoose.model('Product');

router.post('/product',async(req,res) => {

    const newProduct = new Product({
        productName: req.body.productName,
        category: req.body.category,
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


router.get('/product',async (req,res)=>{
       let products
    try{
        products = await Product.find()
    }catch(err){
        const error = new Error("Unable to find products")
        error.code = 500;
        return res.status(error.code).json(error.message)
    }

  //  return res.status(500).json({products})
    return res.status(200).json(products)
})

module.exports = router