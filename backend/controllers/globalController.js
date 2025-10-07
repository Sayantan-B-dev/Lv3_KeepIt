
import Category from "../models/category.js"
import Note from "../models/note.js"

export const getAllCategories = async (req, res) => {
    try {
        const { page = 1, limit = 15, search = '' } = req.query;
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 15, 1), 100);

        const query = {};
        if (search && typeof search === 'string') {
            query.name = { $regex: search.trim(), $options: 'i' };
        }

        const categories = await Category.find(query, 'name user')
            .sort({ name: 1 })
            .skip((pageNum - 1) * pageLimit)
            .limit(pageLimit)
            .populate('user', 'username email profileImage')
            .lean();

        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
}

export const getAllNotes = async (req, res) => {
    try {
        const { page = 1, limit = 15, search = '' } = req.query;
        const pageNum = Math.max(parseInt(page, 10) || 1, 1);
        const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 15, 1), 100);

        const query = {};
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
        console.error('Error fetching notes:', error);
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
}
