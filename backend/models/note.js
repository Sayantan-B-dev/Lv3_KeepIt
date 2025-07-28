import mongoose from "mongoose";

const noteSchema =new mongoose.Schema({
    title:{type:String,required:true,maxLength:200},
    content:{type:String},
    isPrivate:{type:Boolean,required:true,default:false},
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    tags: [{ type: String, trim: true, maxlength: 30 }],

},{timestamps:true})

const Note=mongoose.model('Note',noteSchema)
export default Note