import Category from "../models/category.model.js"
import Note from "../models/note.model.js"
import User from "../models/user.model.js"
import Stats from "../models/stats.model.js"

export const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = "" } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 15, 1), 100);

    const query = { isPrivate: false };
    if (search && typeof search === "string") {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    const categories = await Category.find(query, "name user categoryType")
      .populate("categoryType", "name")
      .populate("user", "username email profileImage")
      .sort({ name: 1 })
      .skip((pageNum - 1) * pageLimit)
      .limit(pageLimit)
      .lean();

    res.json(categories);
  } catch (error) {
    //console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};


export const getAllNotes = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = '' } = req.query;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 15, 1), 100);

    const query = { isPrivate: false };
    if (search && typeof search === 'string') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    const notes = await Note.find(query, 'title user')
      .populate('category', 'name')
      .populate('user', 'username email profileImage')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageLimit)
      .limit(pageLimit)
      .lean();

    res.json(notes);
  } catch (error) {
    //console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
}

export const getMetrics = async (req, res) => {
  try {
    const [totalNotes, totalTags, totalCategories, totalUsers] = await Promise.all([
      Note.countDocuments({ isPrivate: false }),
      Note.distinct("tags", { isPrivate: false }),
      Category.countDocuments({ isPrivate: false }),
      User.countDocuments(),
    ]);

    const metrics = {
        totalNotes: totalNotes || 0,
        totalTags: totalTags.length || 0,
        totalCategories: totalCategories || 0,
        totalUsers: totalUsers || 0,
    };

    // Keep cached stats updated
    await Stats.findOneAndUpdate({}, { ...metrics, lastUpdated: new Date() }, { upsert: true });

    res.json(metrics);
  } catch (error) {
    //console.error("Error fetching metrics:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
};

export const getInitialData = async (req, res) => {
    try {
        const stats = await Stats.findOne().sort({ lastUpdated: -1 });
        res.json(stats || {
            totalNotes: 0,
            totalTags: 0,
            totalCategories: 0,
            totalUsers: 0
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch initial stats" });
    }
}
