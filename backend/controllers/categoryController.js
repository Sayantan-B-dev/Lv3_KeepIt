import Category from "../models/category.js";
import User from "../models/user.js";
import CategoryType from "../models/categoryType.js";

export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id)
      .populate("categoryType", "name")
      .populate("user", "username profileImage bio location website")
      .select("-notes"); // ⛔ exclude notes explicitly

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    console.error("Error in getCategoryById:", err);
    res.status(500).json({
      error: "Failed to fetch category",
    });
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
    const { id } = req.params;
    await Category.findOneAndDelete({ _id: id, user: req.user._id });
    await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { categories: id } }
    );
    res.json({ message: "Category Deleted" });
}

