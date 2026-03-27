import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 200 },
  content: { type: String },
  isPrivate: { type: Boolean, required: true, default: false },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  tags: [{ 
    type: String, 
    trim: true, 
    lowercase: true, 
    maxlength: 30 
  }]

}, { timestamps: true });



// Optimized Indexes for performance
noteSchema.index({ user: 1, createdAt: -1 });      // Recent notes for user
noteSchema.index({ user: 1, updatedAt: -1 });      // Recently updated notes for user
noteSchema.index({ user: 1, category: 1, title: 1 }); // Notes in a category for a user
noteSchema.index({ isPrivate: 1, createdAt: -1 }); // Global public notes feed
noteSchema.index({ category: 1, isPrivate: 1, title: 1 }); // Notes in a public category
noteSchema.index({ tags: 1, isPrivate: 1, createdAt: -1 }); // Search by tag (public only)
noteSchema.index({ user: 1, isPrivate: 1, createdAt: -1 }); // User-specific privacy views

// Text index for full-text search
noteSchema.index({ title: "text", content: "text" });

const Note = mongoose.model('Note', noteSchema);

export default Note;