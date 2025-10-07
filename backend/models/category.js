
import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    name:{type:String,required:true,maxLength:50,minLength:3},
    type:{type:String},
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

// Indexes for faster lookups
categorySchema.index({ user: 1, createdAt: -1 })
categorySchema.index({ name: 1 })

const Category=mongoose.model('Category',categorySchema)



export default Category