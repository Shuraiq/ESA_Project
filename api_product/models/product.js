const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    productModel: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    availableQuantity:{
        type: Number,
        required: true,
    },
})

mongoose.model('Product',productSchema);