import mongoose from "mongoose";

const statsSchema = new mongoose.Schema({
  totalNotes: { type: Number, default: 0 },
  totalTags: { type: Number, default: 0 },
  totalCategories: { type: Number, default: 0 },
  totalUsers: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const Stats = mongoose.model("Stats", statsSchema);

export default Stats;
