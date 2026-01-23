// scripts/seedCategoryTypes.js
import mongoose from "mongoose";
import Category from "../models/category.model.js";
import CategoryType from "../models/categoryType.model.js";
import dotenv from "dotenv";

dotenv.config({
  path: new URL("../.env", import.meta.url),
});


await mongoose.connect(process.env.DATABASE_URL);

const categories = await Category.find({ type: { $exists: true, $ne: "" } });

const seen = new Set();

for (const cat of categories) {
  const key = `${cat.user}-${cat.type}`;
  if (seen.has(key)) continue;

  seen.add(key);

  await CategoryType.findOneAndUpdate(
    { name: cat.type, user: cat.user },
    { name: cat.type, user: cat.user },
    { upsert: true }
  );
}

console.log("CategoryTypes seeded");
process.exit();
