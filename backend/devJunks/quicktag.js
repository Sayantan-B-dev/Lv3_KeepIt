import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import Category from '../models/category.model.js';
import Note from '../models/note.model.js';

dotenv.config();




const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  const CATEGORY_NAME = 'JavaScript: Understanding the Weird Parts';

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
      await mongoose.connection.close();
      process.exit(0);
    }

    console.log(`Found ${categories.length} categor${categories.length > 1 ? 'ies' : 'y'} named '${CATEGORY_NAME}'.`);

    // Ask user for action
    let action;
    while (true) {
      action = (await askQuestion(
        "Choose an option:\n1. Add a tag\n2. Remove a tag\nEnter 1 or 2: "
      )).trim();
      if (action === '1' || action === '2') break;
      console.log("Invalid input. Please enter 1 or 2.");
    }

    // Ask user for tag string
    let tag = (await askQuestion("Enter the tag string: ")).trim();
    if (!tag) {
      console.log("No tag entered. Exiting.");
      await mongoose.connection.close();
      rl.close();
      process.exit(0);
    }

    let totalMatched = 0;
    let totalModified = 0;

    for (const category of categories) {
      let res;
      if (action === '1') {
        // Add tag
        res = await Note.updateMany(
          { category: category._id },
          { $addToSet: { tags: tag } }
        );
      } else {
        // Remove tag
        res = await Note.updateMany(
          { category: category._id },
          { $pull: { tags: tag } }
        );
      }
      const matched = res.matchedCount ?? res.n ?? 0;
      const modified = res.modifiedCount ?? res.nModified ?? 0;
      totalMatched += matched;
      totalModified += modified;
      console.log(`Category '${category.name}' (${category._id}) → matched: ${matched}, modified: ${modified}`);
    }

    if (action === '1') {
      console.log(`Done adding tag '${tag}'. Total matched: ${totalMatched}, total modified: ${totalModified}.`);
    } else {
      console.log(`Done removing tag '${tag}'. Total matched: ${totalMatched}, total modified: ${totalModified}.`);
    }
    await mongoose.connection.close();
    rl.close();
    process.exit(0);
  } catch (err) {
    console.error('Error running dev script:', err);
    try { await mongoose.connection.close(); } catch {}
    rl.close();
    process.exit(1);
  }
}

main();
