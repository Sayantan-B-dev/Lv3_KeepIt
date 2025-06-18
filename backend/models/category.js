
import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    name:{type:String,required:true},
    isPrivate:{type:Boolean,default:false},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    notes:[{type:mongoose.Schema.Types.ObjectId,ref:'Note'}],
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
},{timestamps:true})

const Category=mongoose.model('Category',categorySchema)

export default Category