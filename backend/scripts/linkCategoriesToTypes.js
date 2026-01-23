import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/category.model.js";
import CategoryType from "../models/categoryType.model.js";

dotenv.config({
  path: new URL("../.env", import.meta.url),
});

if (!process.env.DATABASE_URL) {
  throw new Error("MONGO_URI missing");
}

await mongoose.connect(process.env.DATABASE_URL);

const categories = await Category.find({
  type: { $exists: true, $ne: "" },
});

let linked = 0;

for (const cat of categories) {
  if (cat.categoryType) continue;

  const typeDoc = await CategoryType.findOne({
    name: cat.type,
    user: cat.user,
  });

  if (typeDoc) {
    cat.categoryType = typeDoc._id;
    await cat.save();
    linked++;
  }
}

console.log(`Linked ${linked} categories to CategoryTypes`);
process.exit(0);
