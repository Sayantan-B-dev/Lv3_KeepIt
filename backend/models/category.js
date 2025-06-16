
import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    name:{type:String,required:true},
    isPrivate:{type:Boolean,default:false},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
},{timestamps:true})

const Category=mongoose.model('Category',categorySchema)

export default Category