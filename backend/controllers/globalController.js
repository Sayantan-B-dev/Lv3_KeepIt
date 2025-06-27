
import Category from "../models/category.js"
import Note from "../models/note.js"

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({}, 'name user').populate('user', 'username email profileImage');
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
}

export const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({}, 'title content user').populate('category', 'name').populate('user', 'username email profileImage');
        res.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
}
