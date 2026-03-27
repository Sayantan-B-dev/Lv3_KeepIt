import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const profileImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: { type: String, required: true },
});

profileImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const userSchema = new mongoose.Schema({
  username: { type: String, maxLength: 20, minLength: 3, required: true },
  email: { type: String, required: true, unique: true, maxLength: 128, minLength: 3 },
  profileImage: profileImageSchema,
  bio: { type: String, maxLength: 200 },
  location: { type: String, maxLength: 128 },
  website: { type: String, maxLength: 128 },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  isPremium: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  registrationIp: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  otp: String,
  otpExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.plugin(passportLocalMongoose);

// Optimized Indexes
userSchema.index({ registrationIp: 1, createdAt: -1 }); // Registration rate limit
userSchema.index({ username: 1 });                       // User lookups by name
userSchema.index({ createdAt: -1 });                    // Global user sorting
userSchema.index({ followers: 1 });                     // Fast cleanup during deletions
userSchema.index({ following: 1 });                     // Link lookups & deletions

const User = mongoose.model("User", userSchema);
export default User;
