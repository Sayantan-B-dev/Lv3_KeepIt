//categoryController.js
import Category from "../models/category.js";
import User from "../models/user.js";
import CategoryType from "../models/categoryType.js";
import Note from "../models/note.js"

export const getPublicCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id)
      .populate("categoryType", "name")
      .populate("user", "username profileImage")
      .lean();

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // fetch ONLY public notes
    const notes = await Note.find({
      category: id,
      isPrivate: false,
    })
      .select("_id title createdAt tags")
      .sort({ title: 1 })
      .lean();

    res.json({
      _id: category._id,
      name: category.name,
      type: category.type,
      categoryType: category.categoryType,
      user: category.user,
      notes,
    });
  } catch (err) {
    console.error("PUBLIC CATEGORY ERROR:", err);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id)
      .populate("categoryType", "name")
      .populate("user", "username profileImage bio website")
      .populate({
        path: "notes",
        select: "_id title createdAt isPrivate",
        options: { sort: { title: 1 } },
      });


    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({
      _id: category._id,
      name: category.name,
      notes: category.notes || [],
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category" });
  }
};


export const getUserCategories = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const categories = await Category.find({ user: req.user._id })
      .populate("categoryType", "name");

    res.json(categories);
  } catch (err) {
    console.error("Error in getUserCategories:", err);
    res.status(500).json({
      error: "Failed to fetch user categories",
      details: err.message,
    });
  }
};


export const createCategory = async (req, res) => {
  try {
    const { name, type, isPrivate } = req.body;

    let categoryTypeDoc = null;

    if (type && typeof type === "string") {
      categoryTypeDoc = await CategoryType.findOneAndUpdate(
        { name: type, user: req.user._id },
        { name: type, user: req.user._id },
        { upsert: true, new: true }
      );
    }

    const category = new Category({
      name,
      type,                               // legacy
      categoryType: categoryTypeDoc?._id, // normalized
      isPrivate: isPrivate || false,
      user: req.user._id,
    });

    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const category = await Category.findOneAndUpdate(
    { _id: id, user: req.user._id },
    req.body,
    { new: true }
  )
  res.json(category)
}

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    console.log("DELETE CATEGORY:", id);

    const category = await Category.findOne({ _id: id, user: userId });
    if (!category) {
      console.log("CATEGORY NOT FOUND");
      return res.status(404).json({ error: "Category not found" });
    }

    await Note.deleteMany({ category: id, user: userId });

    await Category.deleteOne({ _id: id });

    console.log("Pulling from user...");
    await User.updateOne(
      { _id: userId },
      { $pull: { categories: id } }
    );

    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error("DELETE CATEGORY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};



