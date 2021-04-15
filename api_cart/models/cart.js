const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    quantity:{
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
})

mongoose.model('Cart',cartSchema);