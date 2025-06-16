import mongoose from "mongoose";

const noteSchema =new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String},
    isPrivate:{type:Boolean,required:true},
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }

},{timestamps:true})

const Note=mongoose.model('Note',noteSchema)
export default Note