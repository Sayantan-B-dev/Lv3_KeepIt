import mongoose from "mongoose";

const categoryTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate type names per user
categoryTypeSchema.index({ name: 1, user: 1 }, { unique: true });
export default mongoose.model("CategoryType", categoryTypeSchema);
