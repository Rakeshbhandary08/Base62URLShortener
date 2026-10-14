const { Timestamp } = require('mongodb');
const mongoose=require('mongoose');


const urlSchema=new mongoose.Schema({
    fullUrl:{
        type:String,
        required:[true,"Url is required"],
        trim:true,
        minLength:[5,"Url must be at least 5 character long"]
    },
    shortUrl:{
        type:String,
        trim:true,
        unique:true,
        required:true
    }
},{timestamps:true})


const urlModel=mongoose.model('url',urlSchema)

module.exports=urlModel