import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"

const userSchema =new mongoose.Schema({
    googleID:{type:String},
    username:{type:String},
    email: { type: String, required: true, unique: true },
    profileImage:{
        url:String,
        filename:String,
    },
    bio:{type:String},
    location:{type:String},
    website:{type:String},
    followers:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    following:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    createdAt:{type:Date,default:Date.now},
    isPremium:{type:Boolean,default:false},
    isVerified:{type:Boolean,default:false},
    categories:[{type:mongoose.Schema.Types.ObjectId,ref:'Category'}],
})

userSchema.plugin(passportLocalMongoose)

const User =mongoose.model('User',userSchema)

export default User