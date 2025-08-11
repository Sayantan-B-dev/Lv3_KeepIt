import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/category.js';
import Note from './models/note.js';

// Load env
dotenv.config();

async function main() {
  const CATEGORY_NAME = '5thSemDiploma(AI)';
  const TAG_TO_ADD = '5thSem';

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Find all categories matching the name (case-insensitive, exact match)
    const categories = await Category.find({
      name: { $regex: new RegExp(`^${CATEGORY_NAME.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
    }).select('_id name');

    if (!categories.length) {
      console.log(`No categories found named '${CATEGORY_NAME}'. Nothing to do.`);
      process.exit(0);
    }

    console.log(`Found ${categories.length} categor${categories.length > 1 ? 'ies' : 'y'} named '${CATEGORY_NAME}'.`);

    let totalMatched = 0;
    let totalModified = 0;

    for (const category of categories) {
      const res = await Note.updateMany(
        { category: category._id },
        { $addToSet: { tags: TAG_TO_ADD } }
      );
      // res is a Mongoose UpdateResult
      const matched = res.matchedCount ?? res.n ?? 0;
      const modified = res.modifiedCount ?? res.nModified ?? 0;
      totalMatched += matched;
      totalModified += modified;
      console.log(`Category '${category.name}' (${category._id}) → matched: ${matched}, modified: ${modified}`);
    }

    console.log(`Done. Total matched: ${totalMatched}, total modified: ${totalModified}.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error running dev script:', err);
    try { await mongoose.connection.close(); } catch {}
    process.exit(1);
  }
}

main();
