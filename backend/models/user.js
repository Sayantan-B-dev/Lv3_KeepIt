import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"

const userSchema =new mongoose.Schema({
    googleID:{type:String},
    username:{type:String},
    email:{type:String,require:true,unique:true},
    profileImage:{
        url:String,
        filename:String,
    }
})

userSchema.plugin(passportLocalMongoose)

const User =mongoose.model('User',userSchema)

export default User