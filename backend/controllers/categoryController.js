import Category from "../models/category.js";

export const getCategoryById = async (req, res) => {
    const {id}=req.params;
    const category=await Category.findById(id)
        .populate('notes')
        .populate('user', 'username profileImage bio location website')
    res.json(category)
}

export const getUserCategories = async (req, res) => {
    const categories = await Category.find({ user: req.user._id })
    res.json(categories)
}


export const createCategory = async (req, res) => {
    const category = new Category({
        name: req.body.name,
        isPrivate: req.body.isPrivate || false,
        user: req.user._id
    })
    await category.save()
    res.status(201).json(category)
}

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
    await Category.findOneAndDelete({ _id: id, user: req.user._id })
    res.json({ message: "Category Deleted" })
}

