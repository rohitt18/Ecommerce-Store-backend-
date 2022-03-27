const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    // here we'll setup the properties as well as the validations
    name:{
        type:String,
        required:[true, 'product name must be provided'], // first value is true/false and the second one will be that custom error message
    },
    price:{
        type:Number,
        required:[true, 'product price must be provided'],
    },
    featured:{
        type:Boolean,
        default:false, // by default false, so that way we dont need to worry about whether the prdct is featured or not
    },
    rating:{
        type:Number,
        default:4.5,
    },
    createdAt:{
        type:Date,
        default: Date.now(),  // method to set the current time in mongoose
    },
    company:{
        type:String,
        // enum:['ikea','liddy','caressa','marcos'] // to limit the possible options for this property then we go with enum property & in this array we provide those options
        // we can also set a custom error message if the value doesn't match any of these items in this list
        enum:{
            values:['ikea','liddy','caressa','marcos'],
            message:"{VALUE} is not supported",
        },
    }
});

module.exports = mongoose.model("Product", productSchema );