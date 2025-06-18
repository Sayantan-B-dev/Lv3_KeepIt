import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/user.js';
import Category from './models/category.js';
import Note from './models/note.js';

// Load environment variables
dotenv.config();

// Sample data
const users = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    profileImage: {
      url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      filename: 'sample1'
    },
    bio: 'I am a software engineer',
    location: 'New York, NY',
    website: 'https://www.john-doe.com',
    followers: [],
    following: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isPremium: false,
    isVerified: false,
    categories: [
      new mongoose.Types.ObjectId("68502236c983e341bd1e318f"),
      new mongoose.Types.ObjectId("68502236c983e341bd1e3189")
    ],
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    profileImage: {
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      filename: 'sample2'
    },
    bio: 'I am a software engineer',
    location: 'New York, NY',
    website: 'https://www.john-doe.com',
    followers: [new mongoose.Types.ObjectId("68502236c983e341bd1e317d")],
    following: [new mongoose.Types.ObjectId("68502236c983e341bd1e317c")],
    createdAt: new Date(),
    updatedAt: new Date(),
    isPremium: false,
    isVerified: false,
    categories: [new mongoose.Types.ObjectId("68502236c983e341bd1e3189")],
  },
  {
    username: 'alex_wilson',
    email: 'alex@example.com',
    profileImage: {
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      filename: 'sample3'
    },
    bio: 'I am a software engineer',
    location: 'New York, NY',
    website: 'https://www.john-doe.com',
    followers: [],
    following: [new mongoose.Types.ObjectId("68502236c983e341bd1e317c")],
    createdAt: new Date(),
    updatedAt: new Date(),
    isPremium: false,
    isVerified: false,
    categories: [new mongoose.Types.ObjectId("68502236c983e341bd1e318f")],
  }
];

const categories = [
  { name: 'Work', isPrivate: false },
  { name: 'Personal', isPrivate: true },
  { name: 'Study', isPrivate: false },
  { name: 'Ideas', isPrivate: false },
  { name: 'Projects', isPrivate: false }
];

const notes = [
  {
    title: 'Meeting Notes - Project Kickoff',
    content: 'Key points from today\'s project kickoff meeting:\n1. Project timeline: 3 months\n2. Team members assigned\n3. Initial requirements gathered\n4. Next meeting scheduled for next week',
    isPrivate: false
  },
  {
    title: 'Shopping List',
    content: '- Milk\n- Eggs\n- Bread\n- Fruits\n- Vegetables',
    isPrivate: true
  },
  {
    title: 'Book Recommendations',
    content: 'Books to read this month:\n1. The Pragmatic Programmer\n2. Clean Code\n3. Design Patterns\n4. Atomic Habits',
    isPrivate: false
  },
  {
    title: 'Fitness Goals',
    content: 'Weekly fitness goals:\n- Run 5km daily\n- Strength training 3x week\n- Yoga sessions 2x week\n- Track water intake',
    isPrivate: true
  },
  {
    title: 'Travel Plans',
    content: 'Upcoming trip planning:\n- Book flights\n- Research hotels\n- Create itinerary\n- Check visa requirements',
    isPrivate: false
  },
  {
    title: 'Learning Resources',
    content: 'Web development resources:\n- MDN Web Docs\n- React Documentation\n- Node.js Guide\n- MongoDB Tutorial',
    isPrivate: false
  },
  {
    title: 'Recipe Ideas',
    content: 'Dinner recipes to try:\n1. Pasta Carbonara\n2. Chicken Curry\n3. Vegetable Stir Fry\n4. Homemade Pizza',
    isPrivate: true
  },
  {
    title: 'Project Ideas',
    content: 'Future project ideas:\n1. Personal finance tracker\n2. Recipe management app\n3. Fitness progress tracker\n4. Book reading list',
    isPrivate: false
  }
];

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Note.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const createdUsers = await Promise.all(
      users.map(user => User.create(user))
    );

    console.log('Created users');

    // Create categories for each user
    const createdCategories = await Promise.all(
      createdUsers.flatMap(user =>
        categories.map(category =>
          Category.create({
            ...category,
            user: user._id
          })
        )
      )
    );

    console.log('Created categories');

    // Create notes for each user and category
    const createdNotes = await Promise.all(
      createdUsers.flatMap(user =>
        createdCategories
          .filter(category => category.user.toString() === user._id.toString())
          .flatMap(category =>
            notes.map(note =>
              Note.create({
                ...note,
                user: user._id,
                category: category._id
              })
            )
          )
      )
    );

    console.log('Created notes');
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 