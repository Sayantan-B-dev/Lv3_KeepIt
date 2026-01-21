import mongoose from "mongoose";
import Category from "../models/category.js";
import CategoryType from "../models/categoryType.js";
import dotenv from "dotenv";

dotenv.config({
  path: new URL("../.env", import.meta.url),
});

await mongoose.connect(process.env.DATABASE_URL);

const categories = await Category.find({
  type: { $exists: true, $ne: "" },
  categoryType: { $exists: false },
});

let updated = 0;

for (const cat of categories) {
  const categoryType = await CategoryType.findOne({
    name: cat.type,
    user: cat.user,
  });

  if (!categoryType) continue;

  cat.categoryType = categoryType._id;
  await cat.save();
  updated++;
}

console.log(`✅ Linked ${updated} categories to CategoryTypes`);
process.exit();

