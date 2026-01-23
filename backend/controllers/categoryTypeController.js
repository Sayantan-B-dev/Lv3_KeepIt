//categoryTypeController.js
import CategoryType from "../models/categoryType.js";
import Category from "../models/category.js";
import Note from "../models/note.js"
import User from "../models/user.js";

export const getPublicCategoriesByCategoryType = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryType = await CategoryType.findById(id).select("name").lean();
    if (!categoryType) {
      return res.status(404).json({ error: "Category type not found" });
    }

    const categories = await Category.find({
      categoryType: id,
      isPrivate: false,          // 🔒 public only
    })
      .select("_id name createdAt")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      categoryType,
      categories,
    });

  } catch (err) {
    console.error("getPublicCategoriesByCategoryType error:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
/* ================= My Category Types ================= */

export const getMyCategoryTypes = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 15, 50);
    const search = req.query.search?.trim();

    const query = { user: userId };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const types = await CategoryType.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("name createdAt")
      .lean();

    res.status(200).json({
      types,
      page,
      limit,
      hasMore: types.length === limit,
    });
  } catch (err) {
    console.error("getMyCategoryTypes error:", err);
    res.status(500).json({ error: "Failed to fetch category types" });
  }
};

/* ================= Create ================= */

export const createCategoryType = async (req, res) => {
  try {
    const { name } = req.body;

    const type = await CategoryType.create({
      name,
      user: req.user._id,
    });

    res.status(201).json(type);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        error: "Category type already exists",
      });
    }

    console.error("createCategoryType error:", err);
    res.status(500).json({ error: "Failed to create category type" });
  }
};

/* ================= Delete ================= */

export const deleteCategoryType = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const categoryType = await CategoryType.findOne({ _id: id, user: userId });
    if (!categoryType) {
      return res.status(404).json({ error: "Category type not found" });
    }

    const categories = await Category.find(
      { categoryType: id, user: userId },
      "_id"
    );

    const categoryIds = categories.map(c => c._id);

    await Note.deleteMany({ category: { $in: categoryIds } });
    await Category.deleteMany({ _id: { $in: categoryIds } });
    await CategoryType.deleteOne({ _id: id });

    await User.updateOne(
      { _id: userId },
      { $pull: { categories: { $in: categoryIds } } }
    );

    res.json({ message: "Category type and all related data deleted." });
  } catch (err) {
    console.error("deleteCategoryType error:", err);
    res.status(500).json({ error: err.message });
  }
};


/* ================= get category from catgory type ================= */
export const getCategoriesByCategoryType = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the category type belongs to the user
    const categoryType = await CategoryType.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!categoryType) {
      return res.status(404).json({ error: "Category type not found" });
    }

    const categories = await Category.find({
      categoryType: id,
      user: req.user._id,
    })
      .select("_id name isPrivate createdAt")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      categoryType: {
        _id: categoryType._id,
        name: categoryType.name,
      },
      categories,
    });
  } catch (err) {
    console.error("getCategoriesByCategoryType error:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};