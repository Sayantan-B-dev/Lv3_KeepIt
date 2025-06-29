import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"


const profileImageSchema = new mongoose.Schema({
    url:{type:String,required:true},
    filename:{type:String,required:true},
})
profileImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const userSchema =new mongoose.Schema({
    googleID:{type:String},
    username:{type:String},
    email: { type: String, required: true, unique: true },
    profileImage: profileImageSchema,
    bio:{type:String},
    location:{type:String},
    website:{type:String},
    followers:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    following:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    createdAt:{type:Date,default:Date.now},
    isPremium:{type:Boolean,default:false},
    isVerified:{type:Boolean,default:false},
    categories:[{type:mongoose.Schema.Types.ObjectId,ref:'Category'}],
    registrationIp: { type: String },
})

userSchema.plugin(passportLocalMongoose)

const User =mongoose.model('User',userSchema)

export default User

