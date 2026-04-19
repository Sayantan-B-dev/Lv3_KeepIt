
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, maxLength: 100, minLength: 3 },
    type: { type: String },
    categoryType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CategoryType",
        required: false,
    },
    isPrivate: { type: Boolean, default: false },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true })

// Indexes for faster lookups
categorySchema.index({ user: 1, name: 1 });             // Lookup user's category by name
categorySchema.index({ user: 1, createdAt: -1 });       // Recent categories for user
categorySchema.index({ isPrivate: 1, name: 1 });        // Global public categories sorted by name
categorySchema.index({ categoryType: 1, isPrivate: 1, name: 1 }); // Public categories of a type
categorySchema.index({ categoryType: 1, user: 1, name: 1 });    // User's categories of a type

const Category = mongoose.model('Category', categorySchema)



export default Category